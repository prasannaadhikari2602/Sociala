from rest_framework import serializers

from .models import Profile, Interest


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ["id", "name"]


class InterestNameField(serializers.SlugRelatedField):
    """
    Accepts a plain interest name string from the frontend (e.g. "technology")
    instead of a numeric ID, and creates the Interest row if it doesn't exist
    yet. Matching is case-insensitive so "Technology" and "technology" resolve
    to the same row.
    """

    def __init__(self, **kwargs):
        kwargs.setdefault("slug_field", "name")
        kwargs.setdefault("queryset", Interest.objects.all())
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        if not isinstance(data, str) or not data.strip():
            self.fail("invalid")
        name = data.strip().lower()
        interest, _ = Interest.objects.get_or_create(
            name=name,
            defaults={"name": name},
        )
        return interest

    def to_representation(self, obj):
        return getattr(obj, self.slug_field)


class ProfileSerializer(serializers.ModelSerializer):
    """Used to return full profile data (when is_setup=True)."""

    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    interests = InterestSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
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
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_setup", "created_at", "updated_at"]


class ProfileSetupSerializer(serializers.ModelSerializer):
    """First-time profile creation."""

    interests = InterestNameField(many=True, required=False)

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
            "full_name": {"required": True},
        }

    def create(self, validated_data):
        interests = validated_data.pop("interests", [])
        user = self.context["request"].user
        profile, _ = Profile.objects.update_or_create(
            user=user,
            defaults={**validated_data, "is_setup": True},
        )
        if interests:
            profile.interests.set(interests)
        return profile


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Editing an already-setup profile."""

    interests = InterestNameField(many=True, required=False)

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
        interests = validated_data.pop("interests", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if interests is not None:
            instance.interests.set(interests)
        return instance