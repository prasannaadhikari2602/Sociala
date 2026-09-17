from django.urls import path

from . import views


urlpatterns = [

    # Get the current user's notifications
    path(
        "",
        views.NotificationListView.as_view(),
        name="notification-list"
    ),

    # Get the number of unread notifications
    path(
        "unread-count/",
        views.unread_count,
        name="notification-unread-count"
    ),

    # Mark a specific notification as read
    path(
        "<int:pk>/read/",
        views.mark_read,
        name="notification-read"
    ),

    # Mark all notifications as read
    path(
        "read-all/",
        views.mark_all_read,
        name="notification-read-all"
    ),
]
