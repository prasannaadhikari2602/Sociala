from django.urls import path

from . import views


urlpatterns = [
    path("signup", views.SignupView.as_view(), name="signup"),

    path("login", views.LoginView.as_view(), name="login"),

    path("logout", views.LogoutView.as_view(), name="logout"),

    path("delete-account", views.DeleteAccountView.as_view(), name="delete-account"),

    path("email-verify", views.EmailVerifyView.as_view(), name="email-verify"),

    path(
        "email-verify/resend",
        views.ResendEmailVerificationView.as_view(),
        name="email-verify-resend",
    ),

    path(
        "password-reset/request",
        views.PasswordResetRequestView.as_view(),
        name="password-reset-request",
    ),

    path(
        "password-reset/confirm",
        views.PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),

    path("me", views.MeView.as_view(), name="me"),
    
    path(
    "change-password",
    views.ChangePasswordView.as_view(),
    name="change-password",
),
]
