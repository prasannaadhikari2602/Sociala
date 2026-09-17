from rest_framework import serializers

from apps.follows.serializers import UserBriefSerializer
from apps.posts.serializers import PostSerializer

from .models import Share


# Serializer used to return shared post information.
class ShareSerializer(serializers.ModelSerializer):

    # Basic information about the user who shared the post.
    user = UserBriefSerializer(
        read_only=True
    )

    # Complete information about the original post.
    post = PostSerializer(
        read_only=True
    )

    class Meta:
        model = Share

        fields = [
            "id",
            "user",
            "post",
            "caption",
            "created_at",
        ]
