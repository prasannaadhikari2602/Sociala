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
    path("", ProfileListView.as_view(), name="profile-list"),
    path("me/", MyProfileView.as_view(), name="my-profile"),
    path("setup/", ProfileSetupView.as_view(), name="profile-setup"),
    path("interests/", InterestListCreateView.as_view(), name="interest-list"),
    path("<int:user_id>/", ProfileDetailView.as_view(), name="profile-detail"),
]