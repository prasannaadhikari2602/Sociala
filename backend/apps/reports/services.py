from django.utils import timezone

from apps.notifications.services import notify


# Resolve a report after an admin reviews it.
def resolve_report_action(
    report,
    admin_user,
    delete_post=False
):
    # Update the report's review information.
    report.status = (
        "actioned"
        if delete_post
        else "reviewed"
    )

    report.reviewed_by = admin_user
    report.reviewed_at = timezone.now()

    report.save()

    # Remove the reported post when the admin takes action.
    if delete_post:
        post = report.post
        owner = post.user

        post.is_removed = True
        post.save(
            update_fields=["is_removed"]
        )

        # Notify the post owner about the removal.
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

        # Resolve other pending reports for the same post.
        post.reports.filter(
            status="pending"
        ).update(
            status="actioned",
            reviewed_by=admin_user,
            reviewed_at=timezone.now()
        )
