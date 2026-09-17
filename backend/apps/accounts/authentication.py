from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class CookieJWTAuthentication(JWTAuthentication):
    """
    Authenticate users using a JWT stored in an HTTP-only cookie.

    This class only handles authentication:
    - Reads the access token from the cookie.
    - Validates the token.
    - Gets the authenticated user.
    - Sets request.user through DRF authentication.

    It does not return user profile information such as:
    email, username, role, etc.
    That data should be handled by the view.
    """

    def authenticate(self, request):
        # Get the access token from the HTTP-only cookie.
        access_token = request.COOKIES.get("access_token")

        # No cookie means the request is not authenticated.
        if not access_token:
            return None

        try:
            # Validate the JWT access token.
            validated_token = self.get_validated_token(access_token)

        except TokenError as error:
            # Convert SimpleJWT's TokenError into DRF's InvalidToken.
            raise InvalidToken(error.args[0])

        # Get the user associated with the validated token.
        user = self.get_user(validated_token)

        # DRF uses this tuple to set request.user and request.auth.
        return user, validated_token
