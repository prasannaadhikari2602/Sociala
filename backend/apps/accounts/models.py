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

    ROLE_ADMIN = "admin"
    ROLE_USER = "user"
    ROLE_CHOICES = (
        (ROLE_ADMIN, "Admin"),
        (ROLE_USER, "User"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_USER)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.email

    # Required by Django admin / PermissionsMixin plumbing.
    @property
    def is_staff(self):
        return self.role == self.ROLE_ADMIN

    @property
    def is_admin(self):
        return self.role == self.ROLE_ADMIN


class BaseOTPModel(models.Model):
    """
    Shared shape for EmailVerification / PasswordReset:
    a hashed 6-digit code tied to a user, with expiry + single-use tracking.
    """

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="%(class)ss",
        db_column="user_id",
    )
    token_hash = models.CharField(max_length=64)  # sha256 hex digest of the 6-digit code
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    @property
    def is_expired(self) -> bool:
        return timezone.now() >= self.expires_at

    @property
    def is_used(self) -> bool:
        return self.used_at is not None


class EmailVerification(BaseOTPModel):
    class Meta:
        db_table = "email_verifications"


class PasswordReset(BaseOTPModel):
    class Meta:
        db_table = "password_resets"