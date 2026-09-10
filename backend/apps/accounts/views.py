from django.contrib.auth import authenticate as django_authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmailVerification, PasswordReset, User
from .serializers import (
    EmailVerifySerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    SignupSerializer,
)
from .utils import (
    clear_auth_cookies,
    create_email_verification,
    create_password_reset,
    get_tokens_for_user,
    send_password_reset_email,
    send_verification_email,
    set_auth_cookies,
    verify_otp,
)


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        code = create_email_verification(user)
        send_verification_email(user, code)

        return Response(
            {"detail": "Account created. Check your email for the verification code."},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    Validates credentials and issues JWT cookies.

    Note: CookieJWTAuthentication (authentication.py) only *authenticates*
    requests on protected endpoints — it never returns profile data.
    This view is what returns email/username/role, exactly once, at login.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        # Django's ModelBackend looks up by USERNAME_FIELD (email here),
        # but the kwarg is still conventionally named "username".
        user = django_authenticate(request, username=email, password=password)

        if user is None:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"detail": "Account is disabled."}, status=status.HTTP_403_FORBIDDEN)

        if not user.is_verified:
            return Response({"detail": "Email not verified."}, status=status.HTTP_403_FORBIDDEN)

        tokens = get_tokens_for_user(user)

        response = Response(
            {
                "email": user.email,
                "username": user.username,
                "role": user.role,
            },
            status=status.HTTP_200_OK,
        )
        set_auth_cookies(response, tokens)
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out."}, status=status.HTTP_200_OK)
        clear_auth_cookies(response)
        return response


class EmailVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid email or code."}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_verified:
            return Response({"detail": "Email already verified."}, status=status.HTTP_200_OK)

        if not verify_otp(EmailVerification, user, code):
            return Response({"detail": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST)

        user.is_verified = True
        user.save(update_fields=["is_verified", "updated_at"])

        return Response({"detail": "Email verified successfully."}, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    """Step 1 — request a reset code by email."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't leak whether the email exists in the system.
            return Response(
                {"detail": "If that email exists, a code has been sent."}, status=status.HTTP_200_OK
            )

        code = create_password_reset(user)
        send_password_reset_email(user, code)

        return Response(
            {"detail": "If that email exists, a code has been sent."}, status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    """Step 2 — submit the code + a new password."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data["new_password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid email or code."}, status=status.HTTP_400_BAD_REQUEST)

        if not verify_otp(PasswordReset, user, code):
            return Response({"detail": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password", "updated_at"])

        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)