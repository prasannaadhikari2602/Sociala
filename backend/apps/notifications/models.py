from django.conf import settings
from django.db import models


User = settings.AUTH_USER_MODEL


class Notification(models.Model):

    # Types of notifications supported by Sociala
    VERB_CHOICES = [
        ("like", "Liked your post"),
        ("comment", "Commented on your post"),
        ("reply", "Replied to your comment"),
        ("follow", "Started following you"),
        ("share", "Shared your post"),
        ("report_warning", "Your post was reported and removed"),
    ]

    # User who receives the notification
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    # User who triggered the notification
    actor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="+",
        null=True,
        blank=True
    )

    # Type of action that created the notification
    verb = models.CharField(
        max_length=20,
        choices=VERB_CHOICES
    )

    # Optional post related to the notification
    target_post = models.ForeignKey(
        "posts.Post",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+"
    )

    # Optional comment related to the notification
    comment = models.ForeignKey(
        "posts.Comment",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+"
    )

    # Optional custom notification message
    message = models.CharField(
        max_length=255,
        blank=True
    )

    # Track whether the notification has been read
    is_read = models.BooleanField(default=False)

    # When the notification was created
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Show newest notifications first
        ordering = ["-created_at"]
