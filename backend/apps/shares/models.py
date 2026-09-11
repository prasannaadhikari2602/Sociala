from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Share(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shares")
    post = models.ForeignKey("posts.Post", on_delete=models.CASCADE, related_name="shares")
    caption = models.CharField(max_length=280, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["user", "post"], name="unique_user_post_share")
        ]