from rest_framework import serializers

from apps.follows.models import Follow

from .models import Profile, Interest


# Serializer for returning basic interest information.
class InterestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interest
        fields = [
            "id",
            "name",
        ]


# Allows interests to be provided using their name.
class InterestNameField(serializers.SlugRelatedField):

    def __init__(self, **kwargs):
        kwargs.setdefault(
            "slug_field",
            "name"
        )

        kwargs.setdefault(
            "queryset",
            Interest.objects.all()
        )

        super().__init__(**kwargs)

    def to_internal_value(self, data):
        if not isinstance(data, str) or not data.strip():
            self.fail("invalid")

        name = data.strip().lower()

        interest, _ = Interest.objects.get_or_create(
            name=name,
            defaults={
                "name": name
            },
        )

        return interest

    def to_representation(self, obj):
        return getattr(
            obj,
            self.slug_field
        )


# Returns complete profile information.
class ProfileSerializer(serializers.ModelSerializer):
    """Used to return full profile data (when is_setup=True)."""

    user_id = serializers.UUIDField(
        source="user.id",
        read_only=True
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    interests = InterestSerializer(
        many=True,
        read_only=True
    )

    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = Profile

        fields = [
            "id",
            "user_id",
            "username",
            "email",
            "full_name",
            "bio",
            "profile_image",
            "cover_image",
            "location",
            "date_of_birth",
            "interests",
            "is_setup",
            "followers_count",
            "following_count",
            "is_following",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user_id",
            "is_setup",
            "created_at",
            "updated_at",
        ]

    # Count users following this profile's user.
    def get_followers_count(self, obj):
        return Follow.objects.filter(
            following=obj.user
        ).count()

    # Count users this profile's user is following.
    def get_following_count(self, obj):
        return Follow.objects.filter(
            follower=obj.user
        ).count()

    # Check whether the current authenticated user follows this profile's user.
    def get_is_following(self, obj):
        request = self.context.get("request")
        current_user = getattr(request, "user", None)

        if not current_user or not current_user.is_authenticated:
            return False

        # A user never "follows" themselves in this context.
        if current_user.id == obj.user_id:
            return False

        return Follow.objects.filter(
            follower=current_user,
            following=obj.user
        ).exists()


# Serializer used during first-time profile setup.
class ProfileSetupSerializer(serializers.ModelSerializer):
    """First-time profile creation."""

    interests = InterestNameField(
        many=True,
        required=False
    )

    class Meta:
        model = Profile

        fields = [
            "full_name",
            "bio",
            "profile_image",
            "cover_image",
            "location",
            "date_of_birth",
            "interests",
        ]

        extra_kwargs = {
            "full_name": {
                "required": True
            },
        }

    def create(self, validated_data):
        interests = validated_data.pop(
            "interests",
            []
        )

        user = self.context["request"].user

        profile, _ = Profile.objects.update_or_create(
            user=user,
            defaults={
                **validated_data,
                "is_setup": True,
            },
        )

        if interests:
            profile.interests.set(interests)

        return profile


# Serializer used to edit an existing profile.
class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Editing an already-setup profile."""

    interests = InterestNameField(
        many=True,
        required=False
    )

    class Meta:
        model = Profile

        fields = [
            "full_name",
            "bio",
            "profile_image",
            "cover_image",
            "location",
            "date_of_birth",
            "interests",
        ]

    def update(self, instance, validated_data):
        interests = validated_data.pop(
            "interests",
            None
        )

        for attr, value in validated_data.items():
            setattr(
                instance,
                attr,
                value
            )

        instance.save()

        if interests is not None:
            instance.interests.set(interests)

        return instance