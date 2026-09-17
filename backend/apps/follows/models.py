from django.conf import settings
from django.db import models


# Use the project's configured User model
User = settings.AUTH_USER_MODEL


class Follow(models.Model):

    # User who is following
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="following"
    )

    # User who is being followed
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="followers"
    )

    # When the follow relationship was created
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent the same user from following another user more than once
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "following"],
                name="unique_follow"
            )
        ]
