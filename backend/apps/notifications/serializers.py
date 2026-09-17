from rest_framework import serializers

from apps.follows.serializers import UserBriefSerializer
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):

    # Return the actor's basic profile information
    actor = UserBriefSerializer(read_only=True)

    # Return the related post ID as "post_id"
    post_id = serializers.IntegerField(
        source="target_post_id",
        read_only=True
    )

    class Meta:
        model = Notification

        # Fields included in the API response
        fields = [
            "id",
            "actor",
            "verb",
            "post_id",
            "message",
            "is_read",
            "created_at",
        ]
