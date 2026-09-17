from django.conf import settings
from django.db import models


User = settings.AUTH_USER_MODEL


class Share(models.Model):

    # User who shared the post.
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="shares"
    )

    # Original post being shared.
    post = models.ForeignKey(
        "posts.Post",
        on_delete=models.CASCADE,
        related_name="shares"
    )

    # Optional caption added when sharing a post.
    caption = models.CharField(
        max_length=280,
        blank=True
    )

    # When the post was shared.
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        # Show newest shares first.
        ordering = ["-created_at"]

        # Prevent a user from sharing the same post more than once.
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name="unique_user_post_share"
            )
        ]
