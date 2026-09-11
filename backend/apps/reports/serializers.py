from rest_framework import serializers
from apps.follows.serializers import UserBriefSerializer
from apps.posts.serializers import PostSerializer
from .models import Report


class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["id", "post", "reason", "description"]


class ReportAdminSerializer(serializers.ModelSerializer):
    reporter = UserBriefSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Report
        fields = [
            "id", "reporter", "post", "reason", "description",
            "status", "created_at", "reviewed_at",
        ]