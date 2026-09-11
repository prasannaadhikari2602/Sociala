from django.urls import path
from . import views

urlpatterns = [
    path("", views.ReportCreateView.as_view(), name="report-create"),
    path("admin/", views.ReportAdminListView.as_view(), name="report-admin-list"),
    path("admin/<int:pk>/resolve/", views.resolve_report, name="report-resolve"),
]