from django.urls import path

from . import views


urlpatterns = [

    # Create a report for a post.
    path(
        "",
        views.ReportCreateView.as_view(),
        name="report-create"
    ),

    # Admin: list reported posts.
    path(
        "admin/",
        views.ReportAdminListView.as_view(),
        name="report-admin-list"
    ),

    # Admin: resolve a specific report.
    path(
        "admin/<int:pk>/resolve/",
        views.resolve_report,
        name="report-resolve"
    ),
]
