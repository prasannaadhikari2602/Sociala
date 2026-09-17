import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model.

    Note: `password` (the hash) is provided by AbstractBaseUser and is
    managed through set_password()/check_password() — this column IS
    the "passwordhash" field, we don't duplicate it.
    """

    # --- Role choices -----------------------------------------------------
    # Simple two-tier role system: admin vs regular user.
    ROLE_ADMIN = "admin"
    ROLE_USER = "user"
    ROLE_CHOICES = (
        (ROLE_ADMIN, "Admin"),
        (ROLE_USER, "User"),
    )

    # --- Fields -------------------------------------------------------------
    # UUID primary key instead of Django's default auto-incrementing int.
    # `editable=False` keeps it out of forms/admin edit views.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Kept as a separate unique field even though `email` is the login
    # identifier (see USERNAME_FIELD below) — used for display/reference.
    username = models.CharField(max_length=150, unique=True)

    # Login identifier. Indexed + unique since it's used for lookups on
    # every authentication attempt.
    email = models.EmailField(unique=True, db_index=True)

    # Access level for the account; defaults to a regular user.
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_USER)

    # Whether the user has confirmed their email via the OTP flow
    # (see EmailVerification below).
    is_verified = models.BooleanField(default=False)

    # Standard Django flag for soft-disabling an account without deleting it.
    is_active = models.BooleanField(default=True)

    # Timestamps managed automatically by Django on create/update.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Custom manager that knows how to create users/superusers given
    # email as the identifying field (rather than username).
    objects = UserManager()

    # Tells Django's auth system to authenticate via `email` instead of
    # the default `username` field.
    USERNAME_FIELD = "email"
    # Additional fields prompted for when creating a user via createsuperuser.
    REQUIRED_FIELDS = ["username"]

    class Meta:
        # Explicit table name (rather than the Django-generated default).
        db_table = "users"

    def __str__(self):
        return self.email

    # Required by Django admin / PermissionsMixin plumbing.
    @property
    def is_staff(self):
        # Grants Django admin site access to admin-role users only.
        return self.role == self.ROLE_ADMIN

    @property
    def is_admin(self):
        # Convenience alias for role-based checks in app code.
        return self.role == self.ROLE_ADMIN


class BaseOTPModel(models.Model):
    """
    Shared shape for EmailVerification / PasswordReset:
    a hashed 6-digit code tied to a user, with expiry + single-use tracking.
    """

    # Plain auto-incrementing ID is fine here; these rows aren't user-facing.
    id = models.BigAutoField(primary_key=True)

    # Each OTP row belongs to exactly one user; deleting the user cascades
    # and removes their OTP records too.
    # `related_name="%(class)ss"` auto-generates a distinct reverse accessor
    # per concrete subclass (e.g. user.emailverifications, user.passwordresets).
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="%(class)ss",
        db_column="user_id",
    )

    # We never store the raw 6-digit code — only its sha256 hex digest —
    # so a DB leak doesn't expose usable codes.
    token_hash = models.CharField(max_length=64)  # sha256 hex digest of the 6-digit code

    # After this time, the code should be treated as invalid.
    expires_at = models.DateTimeField()

    # Set once the code has been successfully used; null means unused.
    # Enforces single-use semantics at the application level.
    used_at = models.DateTimeField(null=True, blank=True)

    # When the code was generated/issued.
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Abstract base: no table of its own, only used via inheritance.
        abstract = True

    @property
    def is_expired(self) -> bool:
        # True once we've passed the expiry timestamp.
        return timezone.now() >= self.expires_at

    @property
    def is_used(self) -> bool:
        # True if `used_at` has been set (i.e. code was already consumed).
        return self.used_at is not None


class EmailVerification(BaseOTPModel):
    """OTP sent to confirm a user's email address."""

    class Meta:
        db_table = "email_verifications"


class PasswordReset(BaseOTPModel):
    """OTP sent to authorize a password reset request."""

    class Meta:
        db_table = "password_resets"