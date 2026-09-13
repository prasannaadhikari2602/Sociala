from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """
    Grants access to users with role == "admin", or Django is_staff/is_superuser
    as a fallback. The app treats "admin" as an application-level role (see
    MeView, which returns `role`), so admin-only endpoints should gate on that
    rather than relying solely on Django's built-in is_staff flag.
    """

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        return getattr(user, "role", None) == "admin" or user.is_staff or user.is_superuser