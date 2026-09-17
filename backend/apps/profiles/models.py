import uuid

from django.conf import settings
from django.db import models


# Stores interests that users can select for their profiles.
class Interest(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        # Display interests alphabetically.
        ordering = ["name"]

    def __str__(self):
        return self.name


# Stores additional profile information for each user.
class Profile(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    # Basic profile information.
    full_name = models.CharField(
        max_length=255,
        blank=True
    )

    bio = models.TextField(
        max_length=1000,
        blank=True
    )

    profile_image = models.ImageField(
        upload_to="profiles/avatars/",
        blank=True,
        null=True
    )

    cover_image = models.ImageField(
        upload_to="profiles/covers/",
        blank=True,
        null=True
    )

    location = models.CharField(
        max_length=255,
        blank=True
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True
    )

    # Interests selected by the user.
    interests = models.ManyToManyField(
        Interest,
        related_name="profiles",
        blank=True
    )

    # Used to track whether the profile setup is complete.
    is_setup = models.BooleanField(
        default=False
    )

    # Timestamps.
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user}'s profile"
