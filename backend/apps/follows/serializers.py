from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Follow


User = get_user_model()


class UserBriefSerializer(serializers.ModelSerializer):

    # Additional fields returned with the user data
    profile_image = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "full_name",
            "bio",
            "profile_image",
            "is_following",
            "followers_count",
        ]

    # Return the user's profile image URL
    def get_profile_image(self, obj):
        profile = getattr(obj, "profile", None)
        request = self.context.get("request")

        if profile and profile.profile_image and request:
            return request.build_absolute_uri(profile.profile_image.url)

        return None

    # Return full name from the profile, or username if unavailable
    def get_full_name(self, obj):
        return getattr(
            getattr(obj, "profile", None),
            "full_name",
            obj.username
        )

    # Return the user's bio
    def get_bio(self, obj):
        return getattr(
            getattr(obj, "profile", None),
            "bio",
            ""
        )

    # Count how many users follow this user
    def get_followers_count(self, obj):
        return obj.followers.count()

    # Check whether the current user follows this user
    def get_is_following(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            return False

        return Follow.objects.filter(
            follower=user,
            following=obj
        ).exists()
