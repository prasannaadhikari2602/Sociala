# ============================================================
# IMPORTS
# ============================================================

# Used to create SHA-256 hashes for OTP codes.
import hashlib

# Used for logging errors and important events.
import logging

# Used to securely generate random OTP codes.
import secrets

# Used to calculate OTP expiration time.
from datetime import timedelta

# Used to call Brevo's HTTP email API.
# (Render's free tier blocks outbound SMTP ports, so we send
# transactional email over HTTPS instead of SMTP.)
import requests


# Django settings.
from django.conf import settings

# Used to work with timezone-aware dates and times.
from django.utils import timezone


# Django REST Framework SimpleJWT.
# Used to generate access and refresh JWT tokens.
from rest_framework_simplejwt.tokens import RefreshToken


# Import models related to email verification
# and password reset.
from .models import EmailVerification, PasswordReset


# ============================================================
# LOGGER
# ============================================================
# Creates a logger for this module.
#
# If something goes wrong while sending an email,
# the error will be recorded in Django's logs.
logger = logging.getLogger(__name__)


# ============================================================
# OTP SETTINGS
# ============================================================

# OTP will contain exactly 6 digits.
#
# Example:
# 042817
OTP_LENGTH = 6


# How long an OTP remains valid.
#
# First, Django looks for OTP_TTL_MINUTES in settings.py.
# If it does not exist, the default value is 10 minutes.
OTP_TTL_MINUTES = getattr(settings, "OTP_TTL_MINUTES", 10)


# ============================================================
# OTP GENERATION / HASHING
# ============================================================

def generate_otp() -> str:
    """
    Generate a cryptographically secure 6-digit OTP.

    Example:
        042817
        918203
        100452

    secrets.randbelow() is used instead of random.randint()
    because OTPs are security-sensitive values.
    """

    return f"{secrets.randbelow(10 ** OTP_LENGTH):0{OTP_LENGTH}d}"


def hash_token(raw_token: str) -> str:
    """
    Convert the original OTP/token into a SHA-256 hash.

    Instead of storing the actual OTP in the database,
    we store its hash.

    Example:

        Raw OTP:
        042817

        Database:
        SHA-256 hash of 042817
    """

    return hashlib.sha256(raw_token.encode()).hexdigest()


# ============================================================
# EMAIL VERIFICATION OTP
# ============================================================

def create_email_verification(user) -> str:
    """
    Create a new email verification OTP for a user.

    Steps:
        1. Generate a new OTP.
        2. Invalidate previous unused OTPs.
        3. Store the hashed OTP in the database.
        4. Set its expiration time.
        5. Return the original OTP so it can be emailed.
    """

    # Generate a new 6-digit OTP.
    code = generate_otp()

    # Invalidate any previous unused verification codes
    # belonging to this user.
    #
    # used_at=None means the OTP has not been used yet.
    EmailVerification.objects.filter(
        user=user,
        used_at__isnull=True
    ).update(
        used_at=timezone.now()
    )

    # Create a new verification record.
    EmailVerification.objects.create(
        user=user,

        # Store the HASH of the OTP, not the actual OTP.
        token_hash=hash_token(code),

        # OTP expires after OTP_TTL_MINUTES.
        expires_at=timezone.now()
        + timedelta(minutes=OTP_TTL_MINUTES),
    )

    # Return the original OTP.
    # This will be sent to the user's email.
    return code


# ============================================================
# PASSWORD RESET OTP
# ============================================================

def create_password_reset(user) -> str:
    """
    Create a new password reset OTP.

    Steps:
        1. Generate a new OTP.
        2. Invalidate previous unused reset codes.
        3. Store the hashed OTP.
        4. Set expiration time.
        5. Return the original OTP.
    """

    # Generate a new 6-digit OTP.
    code = generate_otp()

    # Invalidate any previous unused password reset codes
    # for this user.
    PasswordReset.objects.filter(
        user=user,
        used_at__isnull=True
    ).update(
        used_at=timezone.now()
    )

    # Store the new password reset record.
    PasswordReset.objects.create(
        user=user,

        # Store only the hashed OTP.
        token_hash=hash_token(code),

        # Set the OTP expiration time.
        expires_at=timezone.now()
        + timedelta(minutes=OTP_TTL_MINUTES),
    )

    # Return the original OTP so it can be emailed.
    return code


# ============================================================
# OTP VERIFICATION
# ============================================================

def verify_otp(model, user, raw_code: str) -> bool:
    """
    Verify an OTP.

    This function works with both:

        EmailVerification
        PasswordReset

    Steps:
        1. Hash the OTP entered by the user.
        2. Find a matching unused OTP.
        3. Check whether it has expired.
        4. Mark it as used.
        5. Return True if valid.
    """

    # Hash the OTP entered by the user.
    token_hash = hash_token(raw_code)

    # Find the newest unused OTP matching:
    #   - the user
    #   - the hashed code
    #
    # order_by("-created_at") means newest OTP first.
    record = (
        model.objects.filter(
            user=user,
            token_hash=token_hash,
            used_at__isnull=True
        )
        .order_by("-created_at")
        .first()
    )

    # No matching OTP was found.
    if record is None:
        return False

    # OTP exists but has expired.
    if record.is_expired:
        return False

    # OTP is valid.
    # Mark it as used so it cannot be reused.
    record.used_at = timezone.now()

    # Save only the used_at field.
    record.save(update_fields=["used_at"])

    return True


# ============================================================
# EMAIL SENDING (via Brevo HTTP API)
# ============================================================
#
# IMPORTANT: This uses Brevo's HTTPS API instead of SMTP.
#
# Render's free tier blocks outbound traffic to SMTP ports
# (25, 465, 587), so the previous SMTP-based approach
# (Django's EmailMultiAlternatives + smtp backend) times out
# in production even though it works locally.
#
# The HTTP API is a normal HTTPS request, so it is not
# affected by that restriction and works on Render's free tier.
#
# Required setting:
#   BREVO_API_KEY  -> from Brevo: SMTP & API -> API Keys tab
#                     (NOT the SMTP key/password used before)
#
# settings.py should read it from the environment, e.g.:
#   BREVO_API_KEY = os.environ.get("BREVO_API_KEY")
# ============================================================

# Brevo's transactional email API endpoint.
BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

# Brevo API key, read from Django settings (sourced from env vars).
BREVO_API_KEY = getattr(settings, "BREVO_API_KEY", None)


def send_transactional_email(
    to_email: str,
    subject: str,
    html_content: str
) -> None:
    """
    Send an HTML transactional email using Brevo's HTTP API.

    If sending the email fails:
        - The error is logged.
        - The exception is NOT passed to the caller.

    This means a temporary API problem will not
    crash signup, verification, or password-reset requests.
    """

    # Guard against a missing API key so we fail loudly in the
    # logs instead of throwing an unclear error deep in requests.
    if not BREVO_API_KEY:
        logger.error(
            "BREVO_API_KEY is not configured; cannot send email to %s",
            to_email
        )
        return

    # Build the request payload in the shape Brevo's API expects.
    payload = {
        "sender": {
            "email": settings.DEFAULT_FROM_EMAIL,
        },
        "to": [
            {"email": to_email}
        ],
        "subject": subject,

        # Brevo accepts raw HTML directly; no plain-text
        # fallback is required.
        "htmlContent": html_content,
    }

    # Required headers for Brevo's transactional email API.
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }

    try:
        # Send the email via Brevo's HTTPS API.
        #
        # timeout=10 prevents a hung request from blocking
        # the web worker indefinitely.
        response = requests.post(
            BREVO_API_URL,
            json=payload,
            headers=headers,
            timeout=10,
        )

        # Raises an exception for any 4xx/5xx response,
        # e.g. an unverified sender or invalid API key.
        response.raise_for_status()

    except Exception:
        # If sending fails, record the full error in the logs.
        #
        # The error is intentionally not raised again, so a
        # temporary API problem does not crash signup,
        # verification, or password-reset requests.
        logger.exception(
            "Failed to send email to %s",
            to_email
        )


# ============================================================
# EMAIL VERIFICATION EMAIL
# ============================================================

def send_verification_email(user, code: str) -> None:
    """
    Send the email verification OTP to the user.
    """

    # HTML content of the verification email.
    html = f"""
        <p>Hi {user.username},</p>

        <p>Your email verification code is:</p>

        <h2 style="letter-spacing:4px;">{code}</h2>

        <p>
            This code expires in {OTP_TTL_MINUTES} minutes.
        </p>
    """

    # Send the email using the common email function.
    send_transactional_email(
        user.email,
        "Verify your email",
        html
    )


# ============================================================
# PASSWORD RESET EMAIL
# ============================================================

def send_password_reset_email(user, code: str) -> None:
    """
    Send the password reset OTP to the user.
    """

    # HTML content of the password reset email.
    html = f"""
        <p>Hi {user.username},</p>

        <p>Your password reset code is:</p>

        <h2 style="letter-spacing:4px;">{code}</h2>

        <p>
            This code expires in {OTP_TTL_MINUTES} minutes.

            If you did not request this,
            you can safely ignore this email.
        </p>
    """

    # Send the email using the common email function.
    send_transactional_email(
        user.email,
        "Reset your password",
        html
    )


# ============================================================
# JWT + COOKIE HELPERS
# ============================================================

def get_tokens_for_user(user) -> dict:
    """
    Generate JWT access and refresh tokens for a user.

    Returns:

        {
            "refresh": "...",
            "access": "..."
        }
    """

    # Create a refresh token for the user.
    refresh = RefreshToken.for_user(user)

    # Return both tokens as strings.
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# ============================================================
# SET AUTHENTICATION COOKIES
# ============================================================

def set_auth_cookies(response, tokens: dict):
    """
    Store the access and refresh JWT tokens inside cookies.

    Cookie settings such as:
        - HttpOnly
        - Secure
        - SameSite

    are taken from Django settings.py.
    """

    # Get the access token lifetime from SIMPLE_JWT.
    #
    # Convert the lifetime from seconds to an integer.
    access_max_age = int(
        settings.SIMPLE_JWT[
            "ACCESS_TOKEN_LIFETIME"
        ].total_seconds()
    )

    # Get the refresh token lifetime.
    refresh_max_age = int(
        settings.SIMPLE_JWT[
            "REFRESH_TOKEN_LIFETIME"
        ].total_seconds()
    )

    # Common cookie security settings.
    #
    # HttpOnly:
    # JavaScript cannot directly access the cookie.
    #
    # Secure:
    # Cookie is sent only over HTTPS when enabled.
    #
    # SameSite:
    # Controls when the browser sends the cookie
    # in cross-site requests.
    cookie_kwargs = dict(
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )

    # --------------------------------------------------------
    # ACCESS TOKEN COOKIE
    # --------------------------------------------------------

    response.set_cookie(
        settings.AUTH_COOKIE_ACCESS,

        # Store the access token.
        tokens["access"],

        # Cookie lifetime.
        max_age=access_max_age,

        # Apply common cookie security settings.
        **cookie_kwargs,
    )

    # --------------------------------------------------------
    # REFRESH TOKEN COOKIE
    # --------------------------------------------------------

    response.set_cookie(
        settings.AUTH_COOKIE_REFRESH,

        # Store the refresh token.
        tokens["refresh"],

        # Cookie lifetime.
        max_age=refresh_max_age,

        # Apply common cookie security settings.
        **cookie_kwargs,
    )

    # Return the modified response.
    return response


# ============================================================
# CLEAR AUTHENTICATION COOKIES
# ============================================================

def clear_auth_cookies(response):
    """
    Delete the access and refresh authentication cookies.

    Usually called during logout.
    """

    # Delete the access token cookie.
    response.delete_cookie(
        settings.AUTH_COOKIE_ACCESS,

        # Use the same SameSite configuration
        # used when creating the cookie.
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )

    # Delete the refresh token cookie.
    response.delete_cookie(
        settings.AUTH_COOKIE_REFRESH,

        # Use the same SameSite configuration.
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )

    # Return the modified response.
    return response