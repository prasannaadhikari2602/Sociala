from django.urls import path
from . import views

urlpatterns = [
    path("explore/", views.UserExploreView.as_view(), name="user-explore"),
    path("<int:user_id>/followers/", views.FollowersListView.as_view(), name="followers-list"),
    path("<int:user_id>/following/", views.FollowingListView.as_view(), name="following-list"),
    path("<int:user_id>/follow/", views.follow_user, name="follow-user"),
    path("<int:user_id>/unfollow/", views.unfollow_user, name="unfollow-user"),
]