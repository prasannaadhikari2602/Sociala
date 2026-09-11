from django.urls import path
from . import views

urlpatterns = [
    path("", views.ShareListCreateView.as_view(), name="share-list-create"),
    path("<int:pk>/", views.ShareDeleteView.as_view(), name="share-delete"),
]