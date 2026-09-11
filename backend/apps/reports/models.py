from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Report(models.Model):
    REASON_CHOICES = [
        ("spam", "Spam"),
        ("harassment", "Harassment or bullying"),
        ("hate_speech", "Hate speech"),
        ("nudity", "Nudity or sexual content"),
        ("violence", "Violence"),
        ("misinformation", "False information"),
        ("other", "Other"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("reviewed", "Reviewed - no action"),
        ("actioned", "Reviewed - post removed"),
    ]

    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reports_made")
    post = models.ForeignKey("posts.Post", on_delete=models.CASCADE, related_name="reports")
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="pending")
    reviewed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="reports_reviewed"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["reporter", "post"], name="unique_user_post_report")
        ]