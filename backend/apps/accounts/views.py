# ============================================================
# IMPORTS
# ============================================================

# Django's authentication function.
# We rename it to django_authenticate to avoid confusion
# with any custom authentication functions.
from django.contrib.auth import authenticate as django_authenticate

# Q allows us to perform OR queries.
# Example:
# email contains search OR username contains search.
from django.db.models import Q

# Generic API views provided by Django REST Framework.
from rest_framework import generics, status

# Permissions determine who is allowed to access a view.
from rest_framework.permissions import AllowAny, IsAuthenticated

# Used to return API responses.
from rest_framework.response import Response

# Base class for creating API views.
from rest_framework.views import APIView


# ============================================================
# MODELS
# ============================================================

# Import authentication-related database models.
from .models import EmailVerification, PasswordReset, User


# ============================================================
# PERMISSIONS
# ============================================================

# Custom permission that allows only admin users.
from .permissions import IsAdminRole


# ============================================================
# SERIALIZERS
# ============================================================

# Import serializers used to validate incoming request data
# and format outgoing response data.
from .serializers import (
    AdminUserListSerializer,
    EmailVerifySerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    SignupSerializer,
    ResendEmailVerificationSerializer,
)


# ============================================================
# UTILITY / SERVICE FUNCTIONS
# ============================================================

# Import reusable authentication helper functions.
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


# ============================================================
# SIGNUP
# ============================================================

class SignupView(APIView):
    """
    Handles new user registration.

    Flow:
        1. Receive signup data.
        2. Validate data using SignupSerializer.
        3. Create the user.
        4. Generate an email verification code.
        5. Send the code to the user's email.
    """

    # Anyone can create an account.
    permission_classes = [AllowAny]

    def post(self, request):

        # Pass the frontend data to the serializer.
        serializer = SignupSerializer(
            data=request.data
        )

        # Validate the submitted data.
        # If validation fails, DRF automatically returns
        # a 400 Bad Request response.
        serializer.is_valid(
            raise_exception=True
        )

        # Create the user using the serializer's create()
        # method.
        user = serializer.save()

        # Generate a new email verification code.
        code = create_email_verification(user)

        # Send the verification code to the user's email.
        send_verification_email(user, code)

        # Tell the frontend that the account was created.
        return Response(
            {
                "detail": (
                    "Account created. "
                    "Check your email for the verification code."
                )
            },
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# LOGIN
# ============================================================

class LoginView(APIView):
    """
    Validates user credentials and creates JWT cookies.

    Flow:
        1. Validate email and password.
        2. Authenticate the user.
        3. Check whether the account is active.
        4. Check whether the email is verified.
        5. Generate JWT access + refresh tokens.
        6. Store the tokens in cookies.

    This view does NOT return profile information.

    The frontend should call:
        GET /accounts/me

    after successful login.
    """

    # Anyone can attempt to log in.
    permission_classes = [AllowAny]

    def post(self, request):

        # Validate login data.
        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # Get the validated email and password.
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        # Authenticate the user using Django's authentication system.
        #
        # username=email means our authentication setup
        # uses the email as the login identifier.
        user = django_authenticate(
            request,
            username=email,
            password=password
        )

        # Authentication failed.
        if user is None:
            return Response(
                {
                    "detail": "Invalid credentials."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Check whether the account is active.
        #
        # Admin suspension sets is_active=False,
        # which prevents login.
        if not user.is_active:
            return Response(
                {
                    "detail": "Account is disabled."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # User must verify their email before logging in.
        if not user.is_verified:
            return Response(
                {
                    "detail": "Email not verified."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Generate JWT access and refresh tokens.
        tokens = get_tokens_for_user(user)

        # Create the successful login response.
        response = Response(
            {
                "detail": "Logged in successfully."
            },
            status=status.HTTP_200_OK,
        )

        # Store access and refresh tokens inside cookies.
        set_auth_cookies(
            response,
            tokens
        )

        return response


# ============================================================
# CURRENT USER / ME
# ============================================================

class MeView(APIView):
    """
    Returns information about the currently authenticated user.

    Authentication is handled by CookieJWTAuthentication.

    The authentication class reads the JWT from the httpOnly
    cookie and identifies request.user.

    Frontend can call this:
        - When the application loads.
        - After refreshing the page.
        - After refreshing authentication state.
    """

    # Only authenticated users can access this endpoint.
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # request.user is the authenticated user.
        user = request.user

        # Return basic profile information.
        return Response(
            {
                "email": user.email,
                "username": user.username,
                "role": user.role,
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# LOGOUT
# ============================================================

class LogoutView(APIView):

    def post(self, request):

        # Create the logout response.
        response = Response(
            {
                "detail": "Logged out."
            },
            status=status.HTTP_200_OK,
        )

        # Delete access and refresh authentication cookies.
        clear_auth_cookies(response)

        return response


# ============================================================
# EMAIL VERIFICATION
# ============================================================

class EmailVerifyView(APIView):

    # Email verification does not require authentication.
    permission_classes = [AllowAny]

    def post(self, request):

        # Validate email and verification code.
        serializer = EmailVerifySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # Get validated values.
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        # Find the user using their email.
        try:
            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            # Do not reveal whether the email exists.
            return Response(
                {
                    "detail": "Invalid email or code."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # The email is already verified.
        if user.is_verified:
            return Response(
                {
                    "detail": "Email already verified."
                },
                status=status.HTTP_200_OK,
            )

        # Check whether the OTP is valid and not expired.
        if not verify_otp(
            EmailVerification,
            user,
            code
        ):
            return Response(
                {
                    "detail": "Invalid or expired code."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Mark the user's email as verified.
        user.is_verified = True

        # Save only the fields that changed.
        user.save(
            update_fields=[
                "is_verified",
                "updated_at"
            ]
        )

        return Response(
            {
                "detail": "Email verified successfully."
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# RESEND EMAIL VERIFICATION
# ============================================================

class ResendEmailVerificationView(APIView):
    """
    Sends a fresh verification code to a user
    who has registered but has not verified their email.
    """

    permission_classes = [AllowAny]

    def post(self, request):

        # Validate the email.
        serializer = ResendEmailVerificationSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data["email"]

        # Find the user.
        try:
            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            # We intentionally return the same message whether
            # or not the email exists.
            #
            # This prevents email/account enumeration.
            return Response(
                {
                    "detail": (
                        "If that account exists and isn't verified, "
                        "a new code has been sent."
                    )
                },
                status=status.HTTP_200_OK,
            )

        # If the email is already verified, no new code is needed.
        if user.is_verified:
            return Response(
                {
                    "detail": (
                        "This email is already verified. "
                        "You can log in."
                    )
                },
                status=status.HTTP_200_OK,
            )

        # Generate a new verification code.
        code = create_email_verification(user)

        # Send the new code through email.
        send_verification_email(
            user,
            code
        )

        return Response(
            {
                "detail": (
                    "If that account exists and isn't verified, "
                    "a new code has been sent."
                )
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# PASSWORD RESET - REQUEST
# ============================================================

class PasswordResetRequestView(APIView):

    # Password reset does not require authentication.
    permission_classes = [AllowAny]

    def post(self, request):

        # Validate the submitted email.
        serializer = PasswordResetRequestSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = serializer.validated_data["email"]

        # Find the account associated with the email.
        try:
            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            # Do not reveal whether the email exists.
            return Response(
                {
                    "detail": (
                        "If that email exists, "
                        "a code has been sent."
                    )
                },
                status=status.HTTP_200_OK,
            )

        # Generate a password reset OTP.
        code = create_password_reset(user)

        # Send the OTP to the user's email.
        send_password_reset_email(
            user,
            code
        )

        # Same response is returned whether the email exists
        # or not to prevent account enumeration.
        return Response(
            {
                "detail": (
                    "If that email exists, "
                    "a code has been sent."
                )
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# PASSWORD RESET - CONFIRM
# ============================================================

class PasswordResetConfirmView(APIView):

    # User does not need to be logged in to reset a password.
    permission_classes = [AllowAny]

    def post(self, request):

        # Validate email, OTP code, and new password.
        serializer = PasswordResetConfirmSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # Get validated data.
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data["new_password"]

        # Find the user.
        try:
            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            return Response(
                {
                    "detail": "Invalid email or code."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify the password reset OTP.
        if not verify_otp(
            PasswordReset,
            user,
            code
        ):
            return Response(
                {
                    "detail": "Invalid or expired code."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Set the new password.
        #
        # set_password() automatically hashes the password
        # before storing it in the database.
        user.set_password(
            new_password
        )

        # Save the new password.
        user.save(
            update_fields=[
                "password",
                "updated_at"
            ]
        )

        return Response(
            {
                "detail": "Password reset successful."
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# DELETE ACCOUNT
# ============================================================

class DeleteAccountView(APIView):
    """
    Permanently deletes the currently authenticated user's account.

    The user must provide their current password before
    the account can be deleted.
    """

    # Only logged-in users can delete their account.
    permission_classes = [IsAuthenticated]

    def post(self, request):

        # Get the password from the request body.
        password = request.data.get(
            "password"
        )

        # Password must be provided.
        if not password:
            return Response(
                {
                    "detail": "Password is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get the currently authenticated user.
        user = request.user

        # Verify the user's current password.
        if not user.check_password(password):
            return Response(
                {
                    "detail": "Incorrect password."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Permanently delete the account.
        user.delete()

        # Create the response after deleting the account.
        response = Response(
            {
                "detail": "Account deleted successfully."
            },
            status=status.HTTP_200_OK,
        )

        # Remove authentication cookies.
        clear_auth_cookies(response)

        return response


# ============================================================
# CHANGE PASSWORD
# ============================================================

class ChangePasswordView(APIView):

    # Only authenticated users can change their password.
    permission_classes = [IsAuthenticated]

    def post(self, request):

        # Get the currently logged-in user.
        user = request.user

        # Get password fields from the request.
        current_password = request.data.get(
            "current_password"
        )

        new_password = request.data.get(
            "new_password"
        )

        confirm_password = request.data.get(
            "confirm_password"
        )

        # ----------------------------------------------------
        # CHECK CURRENT PASSWORD
        # ----------------------------------------------------

        if not current_password:
            return Response(
                {
                    "detail": "Current password is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # CHECK NEW PASSWORD
        # ----------------------------------------------------

        if not new_password:
            return Response(
                {
                    "detail": "New password is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # CHECK PASSWORD CONFIRMATION
        # ----------------------------------------------------

        if not confirm_password:
            return Response(
                {
                    "detail": "Please confirm your new password."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # VERIFY CURRENT PASSWORD
        # ----------------------------------------------------

        if not user.check_password(
            current_password
        ):
            return Response(
                {
                    "detail": "Current password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # CHECK PASSWORD MATCH
        # ----------------------------------------------------

        if new_password != confirm_password:
            return Response(
                {
                    "detail": "New passwords do not match."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # NEW PASSWORD MUST BE DIFFERENT
        # ----------------------------------------------------

        if current_password == new_password:
            return Response(
                {
                    "detail": (
                        "New password must be different "
                        "from your current password."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ----------------------------------------------------
        # CHECK MINIMUM PASSWORD LENGTH
        # ----------------------------------------------------

        if len(new_password) < 8:
            return Response(
                {
                    "detail": (
                        "New password must be at least "
                        "8 characters long."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Set the new password.
        # Django automatically hashes it.
        user.set_password(
            new_password
        )

        # Save the updated password.
        user.save(
            update_fields=["password"]
        )

        return Response(
            {
                "detail": "Password changed successfully."
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# ADMIN: USER MANAGEMENT
# ============================================================


# ------------------------------------------------------------
# ADMIN USER LIST
# ------------------------------------------------------------

class AdminUserListView(generics.ListAPIView):
    """
    Returns a list of users for the admin dashboard.

    Example:
        GET /api/accounts/admin/users?search=&role=&status=

    status can be:
        active
        suspended

    If status is omitted, all users are returned.
    """

    # Serializer used to convert User objects into JSON.
    serializer_class = AdminUserListSerializer

    # Only admin users can access this endpoint.
    permission_classes = [IsAdminRole]

    def get_queryset(self):

        # Start with all users.
        #
        # Newest users appear first.
        qs = User.objects.all().order_by(
            "-created_at"
        )

        # Get optional filters from the URL query parameters.
        search = self.request.query_params.get(
            "search"
        )

        role = self.request.query_params.get(
            "role"
        )

        status_param = self.request.query_params.get(
            "status"
        )

        # ----------------------------------------------------
        # SEARCH FILTER
        # ----------------------------------------------------
        # Search by either email OR username.
        if search:
            qs = qs.filter(
                Q(email__icontains=search)
                |
                Q(username__icontains=search)
            )

        # ----------------------------------------------------
        # ROLE FILTER
        # ----------------------------------------------------
        if role:
            qs = qs.filter(
                role=role
            )

        # ----------------------------------------------------
        # STATUS FILTER
        # ----------------------------------------------------
        if status_param == "active":
            qs = qs.filter(
                is_active=True
            )

        elif status_param == "suspended":
            qs = qs.filter(
                is_active=False
            )

        # Return the final filtered queryset.
        return qs


# ------------------------------------------------------------
# PROTECTED ADMIN CHECK
# ------------------------------------------------------------

def _is_protected_admin_target(user):
    """
    Determines whether a target user is an admin/protected account.

    Admin users, staff users, and superusers are protected from
    being suspended or deleted by these admin endpoints.
    """

    return (
        getattr(user, "role", None) == "admin"
        or user.is_staff
        or user.is_superuser
    )


# ------------------------------------------------------------
# ADMIN SUSPEND USER
# ------------------------------------------------------------

class AdminSuspendUserView(APIView):
    """
    Suspends a user.

    URL:
        POST /api/accounts/admin/users/<id>/suspend

    Suspension is performed by setting:
        is_active = False

    This prevents the user from logging in.
    """

    permission_classes = [IsAdminRole]

    def post(self, request, pk):

        # Find the target user using the UUID/id from the URL.
        try:
            target = User.objects.get(
                id=pk
            )

        except User.DoesNotExist:
            return Response(
                {
                    "detail": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Admin cannot suspend their own account.
        if target.id == request.user.id:
            return Response(
                {
                    "detail": (
                        "You cannot suspend your own account."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Admin cannot suspend another protected admin account.
        if _is_protected_admin_target(target):
            return Response(
                {
                    "detail": (
                        "Admins cannot suspend other admins."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Mark the user as inactive.
        target.is_active = False

        # Save the changed field.
        target.save(
            update_fields=["is_active"]
        )

        return Response(
            {
                "detail": "User suspended.",
                "id": target.id,
                "is_active": target.is_active,
            }
        )


# ------------------------------------------------------------
# ADMIN UNSUSPEND USER
# ------------------------------------------------------------

class AdminUnsuspendUserView(APIView):
    """
    Reactivates a suspended user.

    URL:
        POST /api/accounts/admin/users/<id>/unsuspend
    """

    permission_classes = [IsAdminRole]

    def post(self, request, pk):

        # Find the target user.
        try:
            target = User.objects.get(
                id=pk
            )

        except User.DoesNotExist:
            return Response(
                {
                    "detail": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Reactivate the user.
        target.is_active = True

        # Save the changed field.
        target.save(
            update_fields=["is_active"]
        )

        return Response(
            {
                "detail": "User unsuspended.",
                "id": target.id,
                "is_active": target.is_active,
            }
        )


# ------------------------------------------------------------
# ADMIN DELETE USER
# ------------------------------------------------------------

class AdminDeleteUserView(APIView):
    """
    Permanently deletes a user account.

    URL:
        POST /api/accounts/admin/users/<id>/delete
    """

    permission_classes = [IsAdminRole]

    def post(self, request, pk):

        # Find the target user.
        try:
            target = User.objects.get(
                id=pk
            )

        except User.DoesNotExist:
            return Response(
                {
                    "detail": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Admin cannot delete their own account through
        # this admin endpoint.
        if target.id == request.user.id:
            return Response(
                {
                    "detail": (
                        "You cannot delete your own "
                        "account from here."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Protected admin accounts cannot be deleted.
        if _is_protected_admin_target(target):
            return Response(
                {
                    "detail": (
                        "Admins cannot delete other admins."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Permanently delete the target user.
        target.delete()

        return Response(
            {
                "detail": "User deleted."
            },
            status=status.HTTP_200_OK,
        )


# ------------------------------------------------------------
# ADMIN DASHBOARD STATISTICS
# ------------------------------------------------------------

class AdminDashboardStatsView(APIView):
    """
    Returns statistics and recent activity for the admin dashboard.

    URL:
        GET /api/accounts/admin/dashboard-stats

    The Post and Report models are imported inside the method
    to avoid a hard cross-app import when this file is loaded.
    """

    permission_classes = [IsAdminRole]

    def get(self, request):

        # Import these models locally.
        from apps.posts.models import Post
        from apps.reports.models import Report

        # ====================================================
        # DASHBOARD COUNTERS
        # ====================================================

        # Count all users.
        total_users = User.objects.count()

        # Count posts that have not been removed.
        total_posts = Post.objects.filter(
            is_removed=False
        ).count()

        # Count reports that are still pending.
        reported_posts = Report.objects.filter(
            status="pending"
        ).count()

        # Count users who are currently inactive/banned.
        banned_users = User.objects.filter(
            is_active=False
        ).count()

        # ====================================================
        # RECENT USERS
        # ====================================================

        # Get the 5 newest users.
        recent_users = User.objects.order_by(
            "-created_at"
        )[:5]

        # Convert User objects into dictionaries
        # that can be returned as JSON.
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

        # ====================================================
        # PENDING REPORTS
        # ====================================================

        # Get the 5 most recent pending reports.
        #
        # select_related() loads the related reporter and post
        # efficiently in the same database query.
        pending_reports = (
            Report.objects.filter(
                status="pending"
            )
            .select_related(
                "reporter",
                "post"
            )
            .order_by(
                "-created_at"
            )[:5]
        )

        # Convert report objects into dictionaries.
        pending_reports_data = [
            {
                "id": r.id,
                "reason": r.reason,
                "reporter_username": r.reporter.username,
                "post_id": r.post_id,
            }
            for r in pending_reports
        ]

        # ====================================================
        # RETURN DASHBOARD DATA
        # ====================================================

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
