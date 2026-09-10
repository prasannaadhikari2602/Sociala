import hashlib
import secrets
from datetime import timedelta

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailVerification, PasswordReset

OTP_LENGTH = 6
OTP_TTL_MINUTES = getattr(settings, "OTP_TTL_MINUTES", 10)


# ---------------------------------------------------------------------------
# OTP generation / hashing
# ---------------------------------------------------------------------------

def generate_otp() -> str:
    """Cryptographically-secure 6-digit numeric code, e.g. '042817'."""
    return f"{secrets.randbelow(10 ** OTP_LENGTH):0{OTP_LENGTH}d}"


def hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode()).hexdigest()


def create_email_verification(user) -> str:
    code = generate_otp()
    # invalidate any previous unused codes for this user
    EmailVerification.objects.filter(user=user, used_at__isnull=True).update(
        used_at=timezone.now()
    )
    EmailVerification.objects.create(
        user=user,
        token_hash=hash_token(code),
        expires_at=timezone.now() + timedelta(minutes=OTP_TTL_MINUTES),
    )
    return code


def create_password_reset(user) -> str:
    code = generate_otp()
    PasswordReset.objects.filter(user=user, used_at__isnull=True).update(
        used_at=timezone.now()
    )
    PasswordReset.objects.create(
        user=user,
        token_hash=hash_token(code),
        expires_at=timezone.now() + timedelta(minutes=OTP_TTL_MINUTES),
    )
    return code


def verify_otp(model, user, raw_code: str) -> bool:
    """
    Generic verifier for EmailVerification / PasswordReset rows.
    Marks the matching row as used if it's valid.
    """
    token_hash = hash_token(raw_code)
    record = (
        model.objects.filter(user=user, token_hash=token_hash, used_at__isnull=True)
        .order_by("-created_at")
        .first()
    )

    if record is None:
        return False
    if record.is_expired:
        return False

    record.used_at = timezone.now()
    record.save(update_fields=["used_at"])
    return True


# ---------------------------------------------------------------------------
# Email sending — Django's SMTP backend, relayed through Brevo
# (EMAIL_HOST=smtp-relay.brevo.com etc. in settings/.env)
# ---------------------------------------------------------------------------

def send_transactional_email(to_email: str, subject: str, html_content: str) -> None:
    """
    Sends an HTML email via Django's configured EMAIL_BACKEND (SMTP, routed
    through Brevo's relay). Raises on failure — callers can decide whether
    a failed send should block the request (e.g. don't fail signup just
    because the verification email didn't go out; log it instead).
    """
    message = EmailMultiAlternatives(
        subject=subject,
        body=html_content,  # plain-text fallback; same content is fine here
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    message.attach_alternative(html_content, "text/html")
    message.send(fail_silently=False)


def send_verification_email(user, code: str) -> None:
    html = f"""
        <p>Hi {user.username},</p>
        <p>Your email verification code is:</p>
        <h2 style="letter-spacing:4px;">{code}</h2>
        <p>This code expires in {OTP_TTL_MINUTES} minutes.</p>
    """
    send_transactional_email(user.email, "Verify your email", html)


def send_password_reset_email(user, code: str) -> None:
    html = f"""
        <p>Hi {user.username},</p>
        <p>Your password reset code is:</p>
        <h2 style="letter-spacing:4px;">{code}</h2>
        <p>This code expires in {OTP_TTL_MINUTES} minutes.
        If you did not request this, you can safely ignore this email.</p>
    """
    send_transactional_email(user.email, "Reset your password", html)


# ---------------------------------------------------------------------------
# JWT + cookie helpers
# ---------------------------------------------------------------------------

def get_tokens_for_user(user) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def set_auth_cookies(response, tokens: dict):
    access_max_age = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
    refresh_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

    cookie_kwargs = dict(
        httponly=True,
        secure=not settings.DEBUG,  # must be True in production (HTTPS)
        samesite="Lax",
    )

    response.set_cookie("access_token", tokens["access"], max_age=access_max_age, **cookie_kwargs)
    response.set_cookie("refresh_token", tokens["refresh"], max_age=refresh_max_age, **cookie_kwargs)
    return response


def clear_auth_cookies(response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response