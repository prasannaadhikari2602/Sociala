from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Post, PostImage, Comment, Like

User = get_user_model()


class PostAuthorSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "full_name", "profile_image"]

    def get_profile_image(self, obj):
        profile = getattr(obj, "profile", None)
        request = self.context.get("request")
        if profile and profile.profile_image and request:
            return request.build_absolute_uri(profile.profile_image.url)
        return None

    def get_full_name(self, obj):
        profile = getattr(obj, "profile", None)
        return getattr(profile, "full_name", obj.username)


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["id", "image", "order"]


class CommentSerializer(serializers.ModelSerializer):
    user = PostAuthorSerializer(read_only=True)
    replies_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id", "post", "user", "parent", "content",
            "replies_count", "created_at", "updated_at",
        ]
        read_only_fields = ["user", "post"]

    def get_replies_count(self, obj):
        return obj.replies.count()


class CommentReplySerializer(CommentSerializer):
    """Used only to nest first-level replies under a parent comment in list view."""
    pass


class PostSerializer(serializers.ModelSerializer):
    user = PostAuthorSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_shared = serializers.SerializerMethodField()
    share_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id", "user", "content", "visibility", "images",
            "like_count", "comment_count", "is_liked",
            "is_shared", "share_count", "created_at", "updated_at",
        ]

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_share_count(self, obj):
        return obj.shares.count()

    def _user(self):
        request = self.context.get("request")
        return getattr(request, "user", None)

    def get_is_liked(self, obj):
        user = self._user()
        if not user or not user.is_authenticated:
            return False
        return obj.likes.filter(user=user).exists()

    def get_is_shared(self, obj):
        user = self._user()
        if not user or not user.is_authenticated:
            return False
        return obj.shares.filter(user=user).exists()


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Post
        fields = ["id", "content", "visibility", "images"]

    def validate(self, attrs):
        if not attrs.get("content") and not self.initial_data.getlist("images"):
            raise serializers.ValidationError("A post needs content or at least one image.")
        return attrs

    def create(self, validated_data):
        images = validated_data.pop("images", [])
        request = self.context["request"]
        post = Post.objects.create(user=request.user, **validated_data)
        for i, img in enumerate(images):
            PostImage.objects.create(post=post, image=img, order=i)
        return post

    def update(self, instance, validated_data):
        images = validated_data.pop("images", None)
        instance.content = validated_data.get("content", instance.content)
        instance.visibility = validated_data.get("visibility", instance.visibility)
        instance.save()
        if images:
            instance.images.all().delete()
            for i, img in enumerate(images):
                PostImage.objects.create(post=instance, image=img, order=i)
        return instance