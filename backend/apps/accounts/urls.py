# Django's URL path function.
from django.urls import path

# Import views from the current app.
from . import views


# ============================================================
# URL PATTERNS
# ============================================================
# Each path connects a URL to a specific Django view.
#
# Example:
#   "signup" -> SignupView
#
# .as_view() converts a class-based view into a callable
# that Django can use to handle the request.
urlpatterns = [

    # ========================================================
    # AUTHENTICATION
    # ========================================================

    # Create a new user account.
    path(
        "signup",
        views.SignupView.as_view(),
        name="signup",
    ),

    # Log the user into their account.
    path(
        "login",
        views.LoginView.as_view(),
        name="login",
    ),

    # Log the current user out.
    path(
        "logout",
        views.LogoutView.as_view(),
        name="logout",
    ),

    # Delete the current user's account.
    path(
        "delete-account",
        views.DeleteAccountView.as_view(),
        name="delete-account",
    ),


    # ========================================================
    # EMAIL VERIFICATION
    # ========================================================

    # Verify the user's email using a verification code.
    path(
        "email-verify",
        views.EmailVerifyView.as_view(),
        name="email-verify",
    ),

    # Send another email verification code.
    path(
        "email-verify/resend",
        views.ResendEmailVerificationView.as_view(),
        name="email-verify-resend",
    ),


    # ========================================================
    # PASSWORD RESET
    # ========================================================

    # Request a password reset code.
    path(
        "password-reset/request",
        views.PasswordResetRequestView.as_view(),
        name="password-reset-request",
    ),

    # Confirm the password reset using the code
    # and set a new password.
    path(
        "password-reset/confirm",
        views.PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),


    # ========================================================
    # CURRENT USER
    # ========================================================

    # Get information about the currently logged-in user.
    path(
        "me",
        views.MeView.as_view(),
        name="me",
    ),

    # Change the password of the currently logged-in user.
    path(
        "change-password",
        views.ChangePasswordView.as_view(),
        name="change-password",
    ),


    # ========================================================
    # ADMIN: USER MANAGEMENT + DASHBOARD
    # ========================================================
    # These endpoints are intended for administrators.
    #
    # The actual permission/security checks are handled
    # inside the corresponding views.


    # --------------------------------------------------------
    # List Users
    # --------------------------------------------------------
    # Allows the admin to retrieve the list of users.
    path(
        "admin/users",
        views.AdminUserListView.as_view(),
        name="admin-user-list",
    ),


    # --------------------------------------------------------
    # Suspend User
    # --------------------------------------------------------
    # <uuid:pk> means Django expects a UUID value in the URL.
    #
    # Example:
    # admin/users/550e8400-e29b-41d4-a716-446655440000/suspend
    #
    # The UUID is passed to the view as "pk".
    path(
        "admin/users/<uuid:pk>/suspend",
        views.AdminSuspendUserView.as_view(),
        name="admin-user-suspend",
    ),


    # --------------------------------------------------------
    # Unsuspend User
    # --------------------------------------------------------
    # Allows an admin to activate a previously suspended user.
    path(
        "admin/users/<uuid:pk>/unsuspend",
        views.AdminUnsuspendUserView.as_view(),
        name="admin-user-unsuspend",
    ),


    # --------------------------------------------------------
    # Delete User
    # --------------------------------------------------------
    # Allows an admin to delete a specific user.
    path(
        "admin/users/<uuid:pk>/delete",
        views.AdminDeleteUserView.as_view(),
        name="admin-user-delete",
    ),


    # --------------------------------------------------------
    # Admin Dashboard Statistics
    # --------------------------------------------------------
    # Returns statistics/data used by the admin dashboard.
    path(
        "admin/dashboard-stats",
        views.AdminDashboardStatsView.as_view(),
        name="admin-dashboard-stats",
    ),
]
