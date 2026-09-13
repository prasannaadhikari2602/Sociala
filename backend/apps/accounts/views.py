from django.contrib.auth import authenticate as django_authenticate
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmailVerification, PasswordReset, User
from .permissions import IsAdminRole
from .serializers import (
    AdminUserListSerializer,
    EmailVerifySerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    SignupSerializer,
    ResendEmailVerificationSerializer,
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

    This view only authenticates and sets the auth cookies — it does not
    return profile data. Callers should hit MeView (GET /accounts/me)
    right after a successful login to fetch email/username/role.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = django_authenticate(request, username=email, password=password)

        if user is None:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"detail": "Account is disabled."}, status=status.HTTP_403_FORBIDDEN)

        if not user.is_verified:
            return Response({"detail": "Email not verified."}, status=status.HTTP_403_FORBIDDEN)

        tokens = get_tokens_for_user(user)

        response = Response({"detail": "Logged in successfully."}, status=status.HTTP_200_OK)
        set_auth_cookies(response, tokens)
        return response


class MeView(APIView):
    """
    Returns the currently authenticated user's profile data.

    Relies on CookieJWTAuthentication to identify request.user from the
    httpOnly JWT cookie. The frontend should call this on app load (and
    after refresh) to rehydrate user state, since it isn't persisted
    anywhere client-side after the one-time LoginView response.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "email": user.email,
                "username": user.username,
                "role": user.role,
            },
            status=status.HTTP_200_OK,
        )


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


class ResendEmailVerificationView(APIView):
    """Re-sends a fresh verification code to a signed-up but unverified user."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendEmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't leak whether the email exists in the system.
            return Response(
                {"detail": "If that account exists and isn't verified, a new code has been sent."},
                status=status.HTTP_200_OK,
            )

        if user.is_verified:
            return Response(
                {"detail": "This email is already verified. You can log in."},
                status=status.HTTP_200_OK,
            )

        code = create_email_verification(user)
        send_verification_email(user, code)

        return Response(
            {"detail": "If that account exists and isn't verified, a new code has been sent."},
            status=status.HTTP_200_OK,
        )

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "If that email exists, a code has been sent."}, status=status.HTTP_200_OK
            )

        code = create_password_reset(user)
        send_password_reset_email(user, code)

        return Response(
            {"detail": "If that email exists, a code has been sent."}, status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
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



class DeleteAccountView(APIView):
    """
    Permanently deletes the currently authenticated user's account.

    The user must provide their current password before the account
    can be deleted.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        password = request.data.get("password")

        if not password:
            return Response(
                {"detail": "Password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user

        # Verify the password before deleting the account.
        if not user.check_password(password):
            return Response(
                {"detail": "Incorrect password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Delete the account permanently.
        user.delete()

        # Remove authentication cookies.
        response = Response(
            {"detail": "Account deleted successfully."},
            status=status.HTTP_200_OK,
        )

        clear_auth_cookies(response)

        return response


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not current_password:
            return Response(
                {"detail": "Current password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_password:
            return Response(
                {"detail": "New password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not confirm_password:
            return Response(
                {"detail": "Please confirm your new password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"detail": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current_password == new_password:
            return Response(
                {
                    "detail": "New password must be different from your current password."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {
                    "detail": "New password must be at least 8 characters long."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response(
            {"detail": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


# --------------------------------------------------------------------------
# ADMIN: user management
# --------------------------------------------------------------------------

class AdminUserListView(generics.ListAPIView):
    """
    GET /api/accounts/admin/users?search=&role=&status=
    status is one of: active | suspended (omit for all)
    """

    serializer_class = AdminUserListSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        qs = User.objects.all().order_by("-created_at")

        search = self.request.query_params.get("search")
        role = self.request.query_params.get("role")
        status_param = self.request.query_params.get("status")

        if search:
            qs = qs.filter(Q(email__icontains=search) | Q(username__icontains=search))
        if role:
            qs = qs.filter(role=role)
        if status_param == "active":
            qs = qs.filter(is_active=True)
        elif status_param == "suspended":
            qs = qs.filter(is_active=False)

        return qs


def _is_protected_admin_target(user):
    """Admins can't suspend/delete other admins (or, via the self-check, themselves)."""
    return getattr(user, "role", None) == "admin" or user.is_staff or user.is_superuser


class AdminSuspendUserView(APIView):
    """POST /api/accounts/admin/users/<id>/suspend — deactivates a user (login blocked)."""

    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            target = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if target.id == request.user.id:
            return Response(
                {"detail": "You cannot suspend your own account."}, status=status.HTTP_400_BAD_REQUEST
            )
        if _is_protected_admin_target(target):
            return Response(
                {"detail": "Admins cannot suspend other admins."}, status=status.HTTP_400_BAD_REQUEST
            )

        target.is_active = False
        target.save(update_fields=["is_active"])

        return Response({"detail": "User suspended.", "id": target.id, "is_active": target.is_active})


class AdminUnsuspendUserView(APIView):
    """POST /api/accounts/admin/users/<id>/unsuspend — reactivates a user."""

    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            target = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        target.is_active = True
        target.save(update_fields=["is_active"])

        return Response({"detail": "User unsuspended.", "id": target.id, "is_active": target.is_active})


class AdminDeleteUserView(APIView):
    """POST /api/accounts/admin/users/<id>/delete — permanently deletes a user account."""

    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            target = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if target.id == request.user.id:
            return Response(
                {"detail": "You cannot delete your own account from here."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if _is_protected_admin_target(target):
            return Response(
                {"detail": "Admins cannot delete other admins."}, status=status.HTTP_400_BAD_REQUEST
            )

        target.delete()

        return Response({"detail": "User deleted."}, status=status.HTTP_200_OK)


class AdminDashboardStatsView(APIView):
    """
    GET /api/accounts/admin/dashboard-stats
    Returns the counters + recent-activity lists shown on the admin dashboard.
    Imports Post/Report locally to avoid a hard cross-app import at module load.
    """

    permission_classes = [IsAdminRole]

    def get(self, request):
        from apps.posts.models import Post
        from apps.reports.models import Report

        total_users = User.objects.count()
        total_posts = Post.objects.filter(is_removed=False).count()
        reported_posts = Report.objects.filter(status="pending").count()
        banned_users = User.objects.filter(is_active=False).count()

        recent_users = User.objects.order_by("-created_at")[:5]
        recent_users_data = [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "is_verified": u.is_verified,
                "is_active": u.is_active,
            }
            for u in recent_users
        ]

        pending_reports = (
            Report.objects.filter(status="pending")
            .select_related("reporter", "post")
            .order_by("-created_at")[:5]
        )
        pending_reports_data = [
            {
                "id": r.id,
                "reason": r.reason,
                "reporter_username": r.reporter.username,
                "post_id": r.post_id,
            }
            for r in pending_reports
        ]

        return Response(
            {
                "total_users": total_users,
                "total_posts": total_posts,
                "reported_posts": reported_posts,
                "banned_users": banned_users,
                "recent_users": recent_users_data,
                "pending_reports": pending_reports_data,
            }
        )