from .models import Notification


def notify(recipient, actor=None, verb="like", target_post=None, comment=None, message=""):
    if recipient == actor:
        return None
    return Notification.objects.create(
        recipient=recipient, actor=actor, verb=verb,
        target_post=target_post, comment=comment, message=message,
    )