from django.db.models import Q
from rest_framework import viewsets, status, permissions, filters, generics
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminRole
from apps.follows.models import Follow
from apps.notifications.services import notify
from apps.shares.models import Share

from .models import Post, Comment, Like
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    PostSerializer,
    PostCreateUpdateSerializer,
    CommentSerializer,
    FeedItemSerializer,
)

# Actions where get_object() just needs "can I see this post at all",
# not "do I own it" — liking, commenting-list, and viewing any post you're
# allowed to see (own / public / friends-if-following).
DETAIL_VISIBILITY_ACTIONS = ["retrieve", "like", "unlike", "comments"]

# Actions where ownership must NOT gate the action at all (anyone allowed
# to see the post can like/unlike it — that's not an edit of the post).
NO_OWNERSHIP_ACTIONS = ["like", "unlike"]


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action in NO_OWNERSHIP_ACTIONS:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]

    def _visible_to_user_queryset(self):
        """
        Any post the current user is actually allowed to see:
        their own (any visibility), anyone's public post, or a friends-only
        post from someone they follow. Used for single-object lookups
        (like/unlike/comments/retrieve) so acting on a stranger's public
        post (e.g. from Explore) doesn't 404 just because you don't follow them.
        """
        user = self.request.user
        following_ids = Follow.objects.filter(follower=user).values_list("following_id", flat=True)
        qs = Post.objects.filter(is_removed=False).select_related("user").prefetch_related(
            "images", "likes", "comments", "shares"
        )
        return qs.filter(
            Q(user=user)
            | Q(visibility="public")
            | Q(user_id__in=following_ids, visibility="friends")
        ).distinct()

    def get_queryset(self):
        if self.action in DETAIL_VISIBILITY_ACTIONS:
            return self._visible_to_user_queryset()

        qs = Post.objects.filter(is_removed=False).select_related("user").prefetch_related(
            "images", "likes", "comments", "shares"
        )
        user = self.request.user
        mine = self.request.query_params.get("mine")
        user_id = self.request.query_params.get("user")

        if mine == "true":
            return qs.filter(user=user)

        if user_id:
            target_qs = qs.filter(user_id=user_id)
            if str(user.id) == str(user_id):
                return target_qs
            follows_target = Follow.objects.filter(follower=user, following_id=user_id).exists()
            if follows_target:
                return target_qs.filter(Q(visibility="public") | Q(visibility="friends"))
            return target_qs.filter(visibility="public")

        following_ids = Follow.objects.filter(follower=user).values_list("following_id", flat=True)
        return qs.filter(
            Q(user=user) | Q(user_id__in=following_ids, visibility__in=["public", "friends"])
        ).distinct()

    def _post_visible(self, post, user, following_ids):
        if post.user_id == user.id:
            return True
        if post.visibility == "public":
            return True
        if post.visibility == "friends" and post.user_id in following_ids:
            return True
        return False

    def _build_feed(self, request, own_only):
        """
        Merge Post rows and Share rows into a single, date-sorted feed.
        Share is a separate model/table, so it's never picked up by a
        plain Post queryset — this is what makes shares actually show up.
        """
        user = request.user
        following_ids = set(
            Follow.objects.filter(follower=user).values_list("following_id", flat=True)
        )

        if own_only:
            post_qs = Post.objects.filter(is_removed=False, user=user)
            share_qs = list(
                Share.objects.filter(user=user).select_related("post", "post__user")
            )
        else:
            visible_share_user_ids = following_ids | {user.id}
            post_qs = Post.objects.filter(is_removed=False).filter(
                Q(user=user) | Q(user_id__in=following_ids, visibility__in=["public", "friends"])
            )
            share_qs = [
                s for s in Share.objects.filter(
                    user_id__in=visible_share_user_ids
                ).select_related("post", "post__user")
                if not s.post.is_removed and self._post_visible(s.post, user, following_ids)
            ]

        post_qs = post_qs.select_related("user").prefetch_related(
            "images", "likes", "comments", "shares"
        ).distinct()

        items = [{"post": p, "share": None, "sort_date": p.created_at} for p in post_qs]
        items += [{"post": s.post, "share": s, "sort_date": s.created_at} for s in share_qs]
        items.sort(key=lambda x: x["sort_date"], reverse=True)

        return FeedItemSerializer(items, many=True, context={"request": request}).data

    def list(self, request, *args, **kwargs):
        mine = request.query_params.get("mine")
        user_id = request.query_params.get("user")
        visibility = request.query_params.get("visibility")

        # Explore (?visibility=public&search=...) and a specific user's
        # profile posts (?user=<id>) keep the original post-only,
        # paginated behavior — shares aren't merged into those views.
        if visibility or user_id:
            return super().list(request, *args, **kwargs)

        if mine == "true":
            return Response(self._build_feed(request, own_only=True))

        return Response(self._build_feed(request, own_only=False))

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
        return Response({"is_liked": True, "likes_count": post.likes.count()})

    @action(detail=True, methods=["post"], url_path="unlike")
    def unlike(self, request, pk=None):
        post = self.get_object()
        Like.objects.filter(user=request.user, post=post).delete()
        return Response({"is_liked": False, "likes_count": post.likes.count()})

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


# --------------------------------------------------------------------------
# ADMIN: post management
# --------------------------------------------------------------------------

class AdminPostListView(generics.ListAPIView):
    """
    GET /api/posts/admin/posts/?search=&user=
    Lists every non-removed post regardless of visibility/ownership, for
    moderation purposes.
    """

    serializer_class = PostSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        qs = (
            Post.objects.filter(is_removed=False)
            .select_related("user")
            .prefetch_related("images", "likes", "comments", "shares")
            .order_by("-created_at")
        )

        search = self.request.query_params.get("search")
        user_id = self.request.query_params.get("user")

        if search:
            qs = qs.filter(Q(content__icontains=search) | Q(user__username__icontains=search))
        if user_id:
            qs = qs.filter(user_id=user_id)

        return qs

    def get_serializer_context(self):
        return {"request": self.request}


class AdminDeletePostView(APIView):
    """POST /api/posts/admin/posts/<id>/delete/ — soft-removes any post."""

    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        post.is_removed = True
        post.save(update_fields=["is_removed"])

        return Response({"detail": "Post removed."}, status=status.HTTP_200_OK)