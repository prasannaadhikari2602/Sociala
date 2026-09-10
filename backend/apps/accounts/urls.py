from django.urls import path

from . import views

urlpatterns = [
    path("signup", views.SignupView.as_view(), name="signup"),
    path("login", views.LoginView.as_view(), name="login"),
    path("logout", views.LogoutView.as_view(), name="logout"),
    path("email-verify", views.EmailVerifyView.as_view(), name="email-verify"),
    path("password-reset/request", views.PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("password-reset/confirm", views.PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
]