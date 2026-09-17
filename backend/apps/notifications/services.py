from .models import Notification


# Create a notification for a user
def notify(
    recipient,
    actor=None,
    verb="like",
    target_post=None,
    comment=None,
    message=""
):

    # Don't create a notification if the user performs
    # an action on themselves
    if recipient == actor:
        return None

    # Create and return the notification
    return Notification.objects.create(
        recipient=recipient,
        actor=actor,
        verb=verb,
        target_post=target_post,
        comment=comment,
        message=message,
    )
