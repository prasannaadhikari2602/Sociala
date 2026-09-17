from django.shortcuts import render

from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Report
from .serializers import (
    ReportCreateSerializer,
    ReportAdminSerializer,
)
from .services import resolve_report_action


# Create a report for a post.
class ReportCreateView(generics.CreateAPIView):
    serializer_class = ReportCreateSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def perform_create(self, serializer):
        serializer.save(
            reporter=self.request.user
        )


# Admin view for reviewing submitted reports.
class ReportAdminListView(generics.ListAPIView):
    serializer_class = ReportAdminSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]

    def get_queryset(self):
        qs = Report.objects.select_related(
            "reporter",
            "post",
            "post__user"
        )

        status_param = self.request.query_params.get(
            "status",
            "pending"
        )

        # Filter by report status unless "all" is requested.
        if status_param != "all":
            qs = qs.filter(
                status=status_param
            )

        return qs


# Resolve a report as an admin.
@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def resolve_report(request, pk):
    report = Report.objects.get(
        id=pk
    )

    delete_post = (
        request.data.get("action") == "delete_post"
    )

    resolve_report_action(
        report,
        request.user,
        delete_post=delete_post
    )

    return Response(
        ReportAdminSerializer(report).data
    )
