from django.db.models import Q
from rest_framework import (
    viewsets,
    status,
    permissions,
    filters,
    generics,
)
from rest_framework.decorators import action
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    JSONParser,
)
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


# Actions that only require post visibility.
# Ownership is not required for these actions.
DETAIL_VISIBILITY_ACTIONS = [
    "retrieve",
    "like",
    "unlike",
    "comments",
]

# Actions that do not require ownership.
NO_OWNERSHIP_ACTIONS = [
    "like",
    "unlike",
]


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_permissions(self):
        if self.action in NO_OWNERSHIP_ACTIONS:
            return [permissions.IsAuthenticated()]

        return [
            permissions.IsAuthenticated(),
            IsOwnerOrReadOnly(),
        ]

    def _visible_to_user_queryset(self):
        """
        Return posts that the current user is allowed to see.

        Includes:
        - The user's own posts
        - Public posts
        - Friends-only posts from users they follow
        """

        user = self.request.user

        following_ids = Follow.objects.filter(
            follower=user
        ).values_list(
            "following_id",
            flat=True
        )

        qs = (
            Post.objects
            .filter(is_removed=False)
            .select_related("user")
            .prefetch_related(
                "images",
                "likes",
                "comments",
                "shares",
            )
        )

        return qs.filter(
            Q(user=user)
            | Q(visibility="public")
            | Q(
                user_id__in=following_ids,
                visibility="friends"
            )
        ).distinct()

    def get_queryset(self):
        if self.action in DETAIL_VISIBILITY_ACTIONS:
            return self._visible_to_user_queryset()

        qs = (
            Post.objects
            .filter(is_removed=False)
            .select_related("user")
            .prefetch_related(
                "images",
                "likes",
                "comments",
                "shares",
            )
        )

        user = self.request.user
        mine = self.request.query_params.get("mine")
        user_id = self.request.query_params.get("user")
        visibility = self.request.query_params.get("visibility")
        search = self.request.query_params.get("search")

        # Return only the current user's posts.
        if mine == "true":
            qs = qs.filter(user=user)

        # Return posts belonging to a specific user.
        elif user_id:
            target_qs = qs.filter(user_id=user_id)

            if str(user.id) == str(user_id):
                qs = target_qs

            else:
                follows_target = Follow.objects.filter(
                    follower=user,
                    following_id=user_id
                ).exists()

                if follows_target:
                    qs = target_qs.filter(
                        Q(visibility="public")
                        | Q(visibility="friends")
                    )

                else:
                    qs = target_qs.filter(
                        visibility="public"
                    )

        # Explore: all public posts (not limited to people you follow).
        elif visibility == "public":
            qs = qs.filter(visibility="public")

        # Default feed: own posts + posts from followed users.
        else:
            following_ids = Follow.objects.filter(
                follower=user
            ).values_list(
                "following_id",
                flat=True
            )

            qs = qs.filter(
                Q(user=user)
                | Q(
                    user_id__in=following_ids,
                    visibility__in=["public", "friends"]
                )
            ).distinct()

        # Apply text search on top of whichever scope was selected above.
        # Matches on post content or the author's username.
        if search:
            qs = qs.filter(
                Q(content__icontains=search)
                | Q(user__username__icontains=search)
            )

        return qs

    def _post_visible(self, post, user, following_ids):
        if post.user_id == user.id:
            return True

        if post.visibility == "public":
            return True

        if (
            post.visibility == "friends"
            and post.user_id in following_ids
        ):
            return True

        return False

    def _build_feed(self, request, own_only):
        """
        Merge Post and Share records into one date-sorted feed.

        Shares use a separate model/table, so they must be fetched
        separately and then combined with normal posts.
        """

        user = request.user

        following_ids = set(
            Follow.objects.filter(
                follower=user
            ).values_list(
                "following_id",
                flat=True
            )
        )

        if own_only:
            post_qs = Post.objects.filter(
                is_removed=False,
                user=user
            )

            share_qs = list(
                Share.objects
                .filter(user=user)
                .select_related(
                    "post",
                    "post__user"
                )
            )

        else:
            visible_share_user_ids = following_ids | {user.id}

            post_qs = (
                Post.objects
                .filter(is_removed=False)
                .filter(
                    Q(user=user)
                    | Q(
                        user_id__in=following_ids,
                        visibility__in=["public", "friends"]
                    )
                )
            )

            share_qs = [
                s
                for s in (
                    Share.objects
                    .filter(
                        user_id__in=visible_share_user_ids
                    )
                    .select_related(
                        "post",
                        "post__user"
                    )
                )
                if (
                    not s.post.is_removed
                    and self._post_visible(
                        s.post,
                        user,
                        following_ids
                    )
                )
            ]

        post_qs = (
            post_qs
            .select_related("user")
            .prefetch_related(
                "images",
                "likes",
                "comments",
                "shares",
            )
            .distinct()
        )

        items = [
            {
                "post": p,
                "share": None,
                "sort_date": p.created_at,
            }
            for p in post_qs
        ]

        items += [
            {
                "post": s.post,
                "share": s,
                "sort_date": s.created_at,
            }
            for s in share_qs
        ]

        # Sort posts and shares together by newest first.
        items.sort(
            key=lambda x: x["sort_date"],
            reverse=True
        )

        return FeedItemSerializer(
            items,
            many=True,
            context={"request": request},
        ).data

    def list(self, request, *args, **kwargs):
        mine = request.query_params.get("mine")
        user_id = request.query_params.get("user")
        visibility = request.query_params.get("visibility")

        # Explore and profile views keep the normal paginated
        # post-only response. Shares are only merged into the feed.
        if visibility or user_id:
            return super().list(
                request,
                *args,
                **kwargs
            )

        if mine == "true":
            return Response(
                self._build_feed(
                    request,
                    own_only=True
                )
            )

        return Response(
            self._build_feed(
                request,
                own_only=False
            )
        )

    def get_serializer_class(self):
        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return PostCreateUpdateSerializer

        return PostSerializer

    def get_serializer_context(self):
        return {
            "request": self.request
        }

    def perform_destroy(self, instance):
        instance.delete()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = PostSerializer(
            instance,
            context={"request": request}
        )

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        post = serializer.save()

        return Response(
            PostSerializer(
                post,
                context={"request": request}
            ).data,
            status=201
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        post = serializer.save()

        return Response(
            PostSerializer(
                post,
                context={"request": request}
            ).data
        )

    # Like a post.
    @action(
        detail=True,
        methods=["post"],
        url_path="like"
    )
    def like(self, request, pk=None):
        post = self.get_object()

        _, created = Like.objects.get_or_create(
            user=request.user,
            post=post
        )

        if (
            created
            and post.user_id != request.user.id
        ):
            notify(
                recipient=post.user,
                actor=request.user,
                verb="like",
                target_post=post,
            )

        return Response({
            "is_liked": True,
            "likes_count": post.likes.count(),
        })

    # Unlike a post.
    @action(
        detail=True,
        methods=["post"],
        url_path="unlike"
    )
    def unlike(self, request, pk=None):
        post = self.get_object()

        Like.objects.filter(
            user=request.user,
            post=post
        ).delete()

        return Response({
            "is_liked": False,
            "likes_count": post.likes.count(),
        })

    # Return the top-level comments for a post.
    @action(
        detail=True,
        methods=["get"],
        url_path="comments"
    )
    def comments(self, request, pk=None):
        post = self.get_object()

        top_level = (
            post.comments
            .filter(parent__isnull=True)
            .select_related("user")
        )

        serializer = CommentSerializer(
            top_level,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly,
    ]

    def get_queryset(self):
        qs = Comment.objects.select_related(
            "user",
            "post"
        )

        post_id = self.request.query_params.get("post")
        parent_id = self.request.query_params.get("parent")

        if post_id:
            qs = qs.filter(
                post_id=post_id
            )

        if parent_id:
            qs = qs.filter(
                parent_id=parent_id
            )

        return qs

    def perform_create(self, serializer):
        post_id = self.request.data.get("post")
        parent_id = self.request.data.get("parent")

        post = Post.objects.get(
            id=post_id
        )

        comment = serializer.save(
            user=self.request.user,
            post=post
        )

        # Notify the parent comment owner when someone replies.
        if parent_id:
            parent = Comment.objects.get(
                id=parent_id
            )

            if parent.user_id != self.request.user.id:
                notify(
                    recipient=parent.user,
                    actor=self.request.user,
                    verb="reply",
                    target_post=post,
                    comment=comment
                )

        # Notify the post owner when someone comments.
        elif post.user_id != self.request.user.id:
            notify(
                recipient=post.user,
                actor=self.request.user,
                verb="comment",
                target_post=post,
                comment=comment
            )


# --------------------------------------------------------------------------
# ADMIN: Post management
# --------------------------------------------------------------------------


class AdminPostListView(generics.ListAPIView):
    """
    GET /api/posts/admin/posts/?search=&user=

    Lists every non-removed post regardless of visibility or ownership.
    This endpoint is used for moderation purposes.
    """

    serializer_class = PostSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        qs = (
            Post.objects
            .filter(is_removed=False)
            .select_related("user")
            .prefetch_related(
                "images",
                "likes",
                "comments",
                "shares"
            )
            .order_by("-created_at")
        )

        search = self.request.query_params.get("search")
        user_id = self.request.query_params.get("user")

        if search:
            qs = qs.filter(
                Q(content__icontains=search)
                | Q(user__username__icontains=search)
            )

        if user_id:
            qs = qs.filter(
                user_id=user_id
            )

        return qs

    def get_serializer_context(self):
        return {
            "request": self.request
        }


class AdminDeletePostView(APIView):
    """
    POST /api/posts/admin/posts/<id>/delete/

    Soft-removes any post.
    """

    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            post = Post.objects.get(
                id=pk
            )

        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        post.is_removed = True

        post.save(
            update_fields=["is_removed"]
        )

        return Response(
            {"detail": "Post removed."},
            status=status.HTTP_200_OK
        )