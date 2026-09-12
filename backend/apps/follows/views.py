from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.notifications.services import notify

from .models import Follow
from .serializers import UserBriefSerializer

User = get_user_model()


class UserExploreView(generics.ListAPIView):
    serializer_class = UserBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        q = self.request.query_params.get("q", "").strip()
        qs = User.objects.exclude(id=self.request.user.id)
        if q:
            qs = qs.filter(
                Q(username__icontains=q) | Q(profile__full_name__icontains=q)
            )
        return qs.select_related("profile")


class FollowersListView(generics.ListAPIView):
    serializer_class = UserBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        get_object_or_404(User, id=user_id)  # 404 instead of empty list for a bad id
        follower_ids = Follow.objects.filter(following_id=user_id).values_list("follower_id", flat=True)
        return User.objects.filter(id__in=follower_ids).select_related("profile")


class FollowingListView(generics.ListAPIView):
    serializer_class = UserBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        get_object_or_404(User, id=user_id)  # 404 instead of empty list for a bad id
        following_ids = Follow.objects.filter(follower_id=user_id).values_list("following_id", flat=True)
        return User.objects.filter(id__in=following_ids).select_related("profile")


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def follow_user(request, user_id):
    if str(request.user.id) == str(user_id):
        return Response({"detail": "You can't follow yourself."}, status=400)

    target = get_object_or_404(User, id=user_id)
    _, created = Follow.objects.get_or_create(follower=request.user, following=target)
    if created:
        notify(recipient=target, actor=request.user, verb="follow")

    return Response({"is_following": True, "followers_count": target.followers.count()})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def unfollow_user(request, user_id):
    target = get_object_or_404(User, id=user_id)
    Follow.objects.filter(follower=request.user, following=target).delete()
    return Response({"is_following": False, "followers_count": target.followers.count()})