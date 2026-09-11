from django.utils import timezone
from apps.notifications.services import notify


def resolve_report_action(report, admin_user, delete_post=False):
    report.status = "actioned" if delete_post else "reviewed"
    report.reviewed_by = admin_user
    report.reviewed_at = timezone.now()
    report.save()

    if delete_post:
        post = report.post
        owner = post.user
        post.is_removed = True
        post.save(update_fields=["is_removed"])
        notify(
            recipient=owner,
            actor=None,
            verb="report_warning",
            message=(
                "One of your posts was removed for violating our community "
                "guidelines after being reported. Repeated violations may lead "
                "to account restrictions."
            ),
        )
        # mark any other pending reports on the same post as actioned too
        post.reports.filter(status="pending").update(
            status="actioned", reviewed_by=admin_user, reviewed_at=timezone.now()
        )