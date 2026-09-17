from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    PostViewSet,
    CommentViewSet,
    AdminPostListView,
    AdminDeletePostView,
)


# Register API endpoints for posts and comments
router = DefaultRouter()

router.register(
    "posts",
    PostViewSet,
    basename="post"
)

router.register(
    "comments",
    CommentViewSet,
    basename="comment"
)


# Combine router URLs with custom admin endpoints
urlpatterns = router.urls + [
    path(
        "admin/posts/",
        AdminPostListView.as_view(),
        name="admin-post-list"
    ),

    path(
        "admin/posts/<int:pk>/delete/",
        AdminDeletePostView.as_view(),
        name="admin-post-delete"
    ),
]
