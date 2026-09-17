from django.urls import path

from .views import (
    MyProfileView,
    ProfileSetupView,
    ProfileDetailView,
    ProfileListView,
    InterestListCreateView,
)


app_name = "profiles"


urlpatterns = [

    # List profiles.
    path(
        "",
        ProfileListView.as_view(),
        name="profile-list"
    ),

    # Get the currently logged-in user's profile.
    path(
        "me/",
        MyProfileView.as_view(),
        name="my-profile"
    ),

    # Create the user's profile during initial setup.
    path(
        "setup/",
        ProfileSetupView.as_view(),
        name="profile-setup"
    ),

    # List and create available interests.
    path(
        "interests/",
        InterestListCreateView.as_view(),
        name="interest-list"
    ),

    # Get a specific user's profile.
    path(
        "<uuid:user_id>/",
        ProfileDetailView.as_view(),
        name="profile-detail"
    ),
]
