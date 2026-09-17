from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.notifications.services import notify

from .models import Follow
from .serializers import UserBriefSerializer


User = get_user_model()


# Explore and search users
class UserExploreView(generics.ListAPIView):
    serializer_class = UserBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get the search query from the URL
        q = self.request.query_params.get("q", "").strip()

        # Exclude the currently logged-in user
        qs = User.objects.exclude(id=self.request.user.id)

        # Search by username or profile full name
        if q:
            qs = qs.filter(
                Q(username__icontains=q)
                | Q(profile__full_name__icontains=q)
            )

        return qs.select_related("profile")


# List users who follow a specific user
class FollowersListView(generics.ListAPIView):
    serializer_class = UserBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]

        # Make sure the requested user exists
        get_object_or_404(User, id=user_id)

        # Get IDs of users who follow this user
        follower_ids = Follow.objects.filter(
            following_id=user_id
        ).values_list(
            "follower_id",
            flat=True
        )

        return User.objects.filter(
            id__in=follower_ids
        ).select_related("profile")


# List users followed by a specific user
class FollowingListView(generics.ListAPIView):
    serializer_class = UserBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]

        # Make sure the requested user exists
        get_object_or_404(User, id=user_id)

        # Get IDs of users this user follows
        following_ids = Follow.objects.filter(
            follower_id=user_id
        ).values_list(
            "following_id",
            flat=True
        )

        return User.objects.filter(
            id__in=following_ids
        ).select_related("profile")


# Follow a user
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def follow_user(request, user_id):

    # Prevent users from following themselves
    if str(request.user.id) == str(user_id):
        return Response(
            {"detail": "You can't follow yourself."},
            status=400
        )

    # Find the user to follow
    target = get_object_or_404(User, id=user_id)

    # Create the follow relationship if it doesn't already exist
    _, created = Follow.objects.get_or_create(
        follower=request.user,
        following=target
    )

    # Send a notification only when a new follow is created
    if created:
        notify(
            recipient=target,
            actor=request.user,
            verb="follow"
        )

    return Response({
        "is_following": True,
        "followers_count": target.followers.count()
    })


# Unfollow a user
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def unfollow_user(request, user_id):

    # Find the user to unfollow
    target = get_object_or_404(User, id=user_id)

    # Remove the follow relationship
    Follow.objects.filter(
        follower=request.user,
        following=target
    ).delete()

    return Response({
        "is_following": False,
        "followers_count": target.followers.count()
    })
