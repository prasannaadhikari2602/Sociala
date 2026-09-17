from rest_framework import generics, permissions

from apps.notifications.services import notify
from apps.posts.models import Post

from .models import Share
from .serializers import ShareSerializer


# List a user's shares or create a new share.
class ShareListCreateView(generics.ListCreateAPIView):
    serializer_class = ShareSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        user_id = self.request.query_params.get(
            "user",
            self.request.user.id
        )

        return (
            Share.objects
            .filter(user_id=user_id)
            .select_related(
                "user",
                "post",
                "post__user"
            )
        )

    def perform_create(self, serializer):
        post = Post.objects.get(
            id=self.request.data.get("post")
        )

        share = serializer.save(
            user=self.request.user,
            post=post
        )

        # Notify the original post owner when another user shares it.
        if post.user_id != self.request.user.id:
            notify(
                recipient=post.user,
                actor=self.request.user,
                verb="share",
                target_post=post
            )

        return share


# Delete a share created by the current user.
class ShareDeleteView(generics.DestroyAPIView):
    serializer_class = ShareSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return Share.objects.filter(
            user=self.request.user
        )
