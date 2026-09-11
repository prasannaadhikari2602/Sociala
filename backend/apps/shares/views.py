from rest_framework import generics, permissions
from apps.posts.models import Post
from apps.notifications.services import notify

from .models import Share
from .serializers import ShareSerializer


class ShareListCreateView(generics.ListCreateAPIView):
    serializer_class = ShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get("user", self.request.user.id)
        return Share.objects.filter(user_id=user_id).select_related("user", "post", "post__user")

    def perform_create(self, serializer):
        post = Post.objects.get(id=self.request.data.get("post"))
        share = serializer.save(user=self.request.user, post=post)
        if post.user_id != self.request.user.id:
            notify(recipient=post.user, actor=self.request.user, verb="share", target_post=post)
        return share


class ShareDeleteView(generics.DestroyAPIView):
    serializer_class = ShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Share.objects.filter(user=self.request.user)