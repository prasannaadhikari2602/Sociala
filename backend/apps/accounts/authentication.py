from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class CookieJWTAuthentication(JWTAuthentication):
    """
    Reads the access token from an httponly cookie instead of the
    Authorization header.

    IMPORTANT: this class ONLY authenticates the request (validates the
    token and resolves request.user). It never returns profile data
    (email, username, role, ...) — that's the responsibility of the
    view that issues the response (see views.LoginView).
    """

    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")

        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        user = self.get_user(validated_token)
        return user, validated_token