from django.urls import path
from . import views


urlpatterns = [

    # Explore users
    path(
        "explore/",
        views.UserExploreView.as_view(),
        name="user-explore"
    ),

    # Followers and following lists
    path(
        "<uuid:user_id>/followers/",
        views.FollowersListView.as_view(),
        name="followers-list"
    ),

    path(
        "<uuid:user_id>/following/",
        views.FollowingListView.as_view(),
        name="following-list"
    ),

    # Follow and unfollow a user
    path(
        "<uuid:user_id>/follow/",
        views.follow_user,
        name="follow-user"
    ),

    path(
        "<uuid:user_id>/unfollow/",
        views.unfollow_user,
        name="unfollow-user"
    ),
]
