import uuid
from django.db import models
from django.conf import settings


class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    full_name = models.CharField(max_length=255, blank=True)
    bio = models.TextField(max_length=1000, blank=True)
    profile_image = models.ImageField(
        upload_to="profiles/avatars/", blank=True, null=True
    )
    cover_image = models.ImageField(
        upload_to="profiles/covers/", blank=True, null=True
    )
    location = models.CharField(max_length=255, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    interests = models.ManyToManyField(Interest, related_name="profiles", blank=True)

    is_setup = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user}'s profile"