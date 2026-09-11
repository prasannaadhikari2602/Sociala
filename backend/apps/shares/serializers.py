from rest_framework import serializers
from apps.follows.serializers import UserBriefSerializer
from apps.posts.serializers import PostSerializer
from .models import Share

class ShareSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Share
        fields = ["id", "user", "post", "caption", "created_at"]