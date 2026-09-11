from django.db.models import Q
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from apps.follows.models import Follow
from apps.notifications.services import notify

from .models import Post, Comment, Like
from .permissions import IsOwnerOrReadOnly
from .serializers import PostSerializer, PostCreateUpdateSerializer, CommentSerializer


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = Post.objects.filter(is_removed=False).select_related("user").prefetch_related(
            "images", "likes", "comments", "shares"
        )
        user = self.request.user
        mine = self.request.query_params.get("mine")
        user_id = self.request.query_params.get("user")

        if mine == "true":
            return qs.filter(user=user)

        if user_id:
            # Someone else's profile: only public, or friends if we follow them, or all if it's me
            target_qs = qs.filter(user_id=user_id)
            if str(user.id) == str(user_id):
                return target_qs
            follows_target = Follow.objects.filter(follower=user, following_id=user_id).exists()
            if follows_target:
                return target_qs.filter(Q(visibility="public") | Q(visibility="friends"))
            return target_qs.filter(visibility="public")

        # Default feed: own posts + posts of people the user follows
        following_ids = Follow.objects.filter(follower=user).values_list("following_id", flat=True)
        return qs.filter(
            Q(user=user) | Q(user_id__in=following_ids, visibility__in=["public", "friends"])
        ).distinct()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PostCreateUpdateSerializer
        return PostSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_destroy(self, instance):
        instance.delete()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = PostSerializer(instance, context={"request": request})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save()
        return Response(PostSerializer(post, context={"request": request}).data, status=201)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        post = serializer.save()
        return Response(PostSerializer(post, context={"request": request}).data)

    @action(detail=True, methods=["post"], url_path="like")
    def like(self, request, pk=None):
        post = self.get_object()
        _, created = Like.objects.get_or_create(user=request.user, post=post)
        if created and post.user_id != request.user.id:
            notify(
                recipient=post.user, actor=request.user,
                verb="like", target_post=post,
            )
        return Response({"is_liked": True, "like_count": post.likes.count()})

    @action(detail=True, methods=["post"], url_path="unlike")
    def unlike(self, request, pk=None):
        post = self.get_object()
        Like.objects.filter(user=request.user, post=post).delete()
        return Response({"is_liked": False, "like_count": post.likes.count()})

    @action(detail=True, methods=["get"], url_path="comments")
    def comments(self, request, pk=None):
        post = self.get_object()
        top_level = post.comments.filter(parent__isnull=True).select_related("user")
        serializer = CommentSerializer(top_level, many=True, context={"request": request})
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        qs = Comment.objects.select_related("user", "post")
        post_id = self.request.query_params.get("post")
        parent_id = self.request.query_params.get("parent")
        if post_id:
            qs = qs.filter(post_id=post_id)
        if parent_id:
            qs = qs.filter(parent_id=parent_id)
        return qs

    def perform_create(self, serializer):
        post_id = self.request.data.get("post")
        parent_id = self.request.data.get("parent")
        post = Post.objects.get(id=post_id)
        comment = serializer.save(user=self.request.user, post=post)

        if parent_id:
            parent = Comment.objects.get(id=parent_id)
            if parent.user_id != self.request.user.id:
                notify(recipient=parent.user, actor=self.request.user,
                       verb="reply", target_post=post, comment=comment)
        elif post.user_id != self.request.user.id:
            notify(recipient=post.user, actor=self.request.user,
                   verb="comment", target_post=post, comment=comment)