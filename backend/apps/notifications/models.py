from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Notification(models.Model):
    VERB_CHOICES = [
        ("like", "Liked your post"),
        ("comment", "Commented on your post"),
        ("reply", "Replied to your comment"),
        ("follow", "Started following you"),
        ("share", "Shared your post"),
        ("report_warning", "Your post was reported and removed"),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    actor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+", null=True, blank=True)
    verb = models.CharField(max_length=20, choices=VERB_CHOICES)
    target_post = models.ForeignKey(
        "posts.Post", on_delete=models.CASCADE, null=True, blank=True, related_name="+"
    )
    comment = models.ForeignKey(
        "posts.Comment", on_delete=models.CASCADE, null=True, blank=True, related_name="+"
    )
    message = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]