from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Post, PostImage, Comment, Like


User = get_user_model()


# Basic user information displayed with a post
class PostAuthorSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "full_name",
            "profile_image",
        ]

    def get_profile_image(self, obj):
        profile = getattr(obj, "profile", None)
        request = self.context.get("request")

        if profile and profile.profile_image and request:
            return request.build_absolute_uri(profile.profile_image.url)

        return None

    def get_full_name(self, obj):
        profile = getattr(obj, "profile", None)
        return getattr(profile, "full_name", obj.username)


# Serializer for images attached to posts
class PostImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostImage
        fields = [
            "id",
            "image",
            "order",
        ]


# Serializer for comments and their reply count
class CommentSerializer(serializers.ModelSerializer):
    user = PostAuthorSerializer(read_only=True)
    replies_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "user",
            "parent",
            "content",
            "replies_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "post",
        ]

    def get_replies_count(self, obj):
        return obj.replies.count()


# Used for nesting first-level replies under a comment
class CommentReplySerializer(CommentSerializer):
    pass


# Serializer for displaying complete post information
class PostSerializer(serializers.ModelSerializer):
    user = PostAuthorSerializer(read_only=True)
    images = PostImageSerializer(many=True, read_only=True)

    image = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    shares_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_shared_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Post

        fields = [
            "id",
            "user",
            "content",
            "visibility",
            "images",
            "image",
            "likes_count",
            "comments_count",
            "is_liked",
            "is_shared_by_me",
            "shares_count",
            "created_at",
            "updated_at",
        ]

    def get_image(self, obj):
        # Return the first image for the frontend's hero image
        first = obj.images.all().order_by("order").first()

        if not first:
            return None

        request = self.context.get("request")

        return (
            request.build_absolute_uri(first.image.url)
            if request
            else first.image.url
        )

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_shares_count(self, obj):
        return obj.shares.count()

    # Get the currently authenticated user
    def _user(self):
        request = self.context.get("request")
        return getattr(request, "user", None)

    def get_is_liked(self, obj):
        user = self._user()

        if not user or not user.is_authenticated:
            return False

        return obj.likes.filter(user=user).exists()

    def get_is_shared_by_me(self, obj):
        user = self._user()

        if not user or not user.is_authenticated:
            return False

        return obj.shares.filter(user=user).exists()


# Serializer used to represent posts and re-shared posts in the feed
class FeedItemSerializer(serializers.Serializer):
    """
    Wraps a single feed entry, which is either a plain Post or a re-share
    of one. `item` is a dict: {"post": Post, "share": Share|None}.

    A plain post is returned exactly as PostSerializer produces it.
    A re-share adds `shared_by`, `share_id`, and `caption` (the resharer's
    own caption) at the top level, and nests the full original post under
    `post` — matching what PostCard.jsx expects.
    """

    def to_representation(self, item):
        request = self.context.get("request")

        post_data = PostSerializer(
            item["post"],
            context={"request": request}
        ).data

        share = item.get("share")

        # Return normal post data when the feed item is not a re-share
        if not share:
            return post_data

        # Add re-share information to the original post data
        return {
            **post_data,
            "shared_by": PostAuthorSerializer(
                share.user,
                context={"request": request}
            ).data,
            "share_id": share.id,
            "caption": share.caption,
            "post": post_data,
        }


# Serializer used when creating or updating a post
class PostCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Post
        fields = [
            "id",
            "content",
            "visibility",
            "images",
        ]

    # Make sure a post contains either content or an image
    def validate(self, attrs):
        if (
            not attrs.get("content")
            and not self.initial_data.getlist("images")
        ):
            raise serializers.ValidationError(
                "A post needs content or at least one image."
            )

        return attrs

    # Create a post and its images
    def create(self, validated_data):
        images = validated_data.pop("images", [])
        request = self.context["request"]

        post = Post.objects.create(
            user=request.user,
            **validated_data
        )

        for i, img in enumerate(images):
            PostImage.objects.create(
                post=post,
                image=img,
                order=i
            )

        return post

    # Update a post and optionally replace its images
    def update(self, instance, validated_data):
        images = validated_data.pop("images", None)

        instance.content = validated_data.get(
            "content",
            instance.content
        )

        instance.visibility = validated_data.get(
            "visibility",
            instance.visibility
        )

        instance.save()

        if images:
            instance.images.all().delete()

            for i, img in enumerate(images):
                PostImage.objects.create(
                    post=instance,
                    image=img,
                    order=i
                )

        return instance
