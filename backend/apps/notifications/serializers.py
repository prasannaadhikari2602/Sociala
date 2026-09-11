from rest_framework import serializers
from apps.follows.serializers import UserBriefSerializer
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    actor = UserBriefSerializer(read_only=True)
    post_id = serializers.IntegerField(source="target_post_id", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "actor", "verb", "post_id", "message", "is_read", "created_at"]