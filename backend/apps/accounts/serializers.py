# Django's built-in password validation system.
# This uses the password validators configured in settings.py.
from django.contrib.auth.password_validation import validate_password

# Django REST Framework serializer classes.
from rest_framework import serializers

# Import our custom User model.
from .models import User


# ============================================================
# SIGNUP SERIALIZER
# ============================================================
# Handles validation and creation of a new user account.
class SignupSerializer(serializers.Serializer):

    # User's email address.
    email = serializers.EmailField()

    # Username with a maximum length of 150 characters.
    username = serializers.CharField(max_length=150)

    # Password is write_only, meaning it can be received from
    # the frontend but will never be returned in the response.
    password = serializers.CharField(write_only=True)

    # --------------------------------------------------------
    # Validate Email
    # --------------------------------------------------------
    # DRF automatically calls validate_email() when
    # validating the "email" field.
    def validate_email(self, value):

        # Remove spaces and convert email to lowercase.
        value = value.strip().lower()

        # Check whether this email already exists.
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already registered."
            )

        return value

    # --------------------------------------------------------
    # Validate Username
    # --------------------------------------------------------
    def validate_username(self, value):

        # Remove unnecessary spaces from the username.
        value = value.strip()

        # Check whether this username already exists.
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Username already taken."
            )

        return value

    # --------------------------------------------------------
    # Validate Password
    # --------------------------------------------------------
    def validate_password(self, value):

        # Uses the password validators configured
        # in settings.py.
        validate_password(value)

        return value

    # --------------------------------------------------------
    # Create User
    # --------------------------------------------------------
    # Called when serializer.save() is used.
    def create(self, validated_data):

        # Use the custom User model's create_user() method.
        return User.objects.create_user(**validated_data)


# ============================================================
# LOGIN SERIALIZER
# ============================================================
# Handles validation of login credentials.
class LoginSerializer(serializers.Serializer):

    # User's email address.
    email = serializers.EmailField()

    # Password is write_only so it is never returned.
    # trim_whitespace=False is important because spaces
    # in a password should not be automatically removed.
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False
    )

    # --------------------------------------------------------
    # Validate Email
    # --------------------------------------------------------
    def validate_email(self, value):

        # Remove spaces and convert email to lowercase.
        return value.strip().lower()


# ============================================================
# EMAIL VERIFICATION SERIALIZER
# ============================================================
# Used when a user enters the verification code
# received through email.
class EmailVerifySerializer(serializers.Serializer):

    # Email of the account being verified.
    email = serializers.EmailField()

    # Verification code must contain exactly 6 digits.
    code = serializers.RegexField(
        regex=r"^\d{6}$",
        error_messages={
            "invalid": "Code must be a 6-digit number."
        }
    )

    # --------------------------------------------------------
    # Validate Email
    # --------------------------------------------------------
    def validate_email(self, value):

        # Normalize the email before using it.
        return value.strip().lower()


# ============================================================
# PASSWORD RESET REQUEST SERIALIZER
# ============================================================
# Used when a user requests a password reset code.
class PasswordResetRequestSerializer(serializers.Serializer):

    # Email where the reset code will be sent.
    email = serializers.EmailField()

    # --------------------------------------------------------
    # Validate Email
    # --------------------------------------------------------
    def validate_email(self, value):

        # Normalize the email.
        return value.strip().lower()


# ============================================================
# PASSWORD RESET CONFIRM SERIALIZER
# ============================================================
# Used when the user submits:
#   - Email
#   - 6-digit reset code
#   - New password
class PasswordResetConfirmSerializer(serializers.Serializer):

    # User's email address.
    email = serializers.EmailField()

    # Password reset code.
    # Must contain exactly 6 digits.
    code = serializers.RegexField(
        regex=r"^\d{6}$",
        error_messages={
            "invalid": "Code must be a 6-digit number."
        }
    )

    # New password entered by the user.
    # write_only prevents it from being returned.
    new_password = serializers.CharField(write_only=True)

    # --------------------------------------------------------
    # Validate Email
    # --------------------------------------------------------
    def validate_email(self, value):

        # Normalize the email.
        return value.strip().lower()

    # --------------------------------------------------------
    # Validate New Password
    # --------------------------------------------------------
    def validate_new_password(self, value):

        # Apply Django's configured password validators.
        validate_password(value)

        return value


# ============================================================
# RESEND EMAIL VERIFICATION SERIALIZER
# ============================================================
# Used when a user requests another verification email.
class ResendEmailVerificationSerializer(serializers.Serializer):

    # Email address that should receive the new code.
    email = serializers.EmailField()


# ============================================================
# ADMIN USER LIST SERIALIZER
# ============================================================
# Used by the admin to retrieve user information.
#
# ModelSerializer automatically gets the field definitions
# from the User model.
class AdminUserListSerializer(serializers.ModelSerializer):

    class Meta:

        # Tell DRF which model this serializer represents.
        model = User

        # Only these User fields will be included
        # in the serialized response.
        fields = [
            "id",
            "email",
            "username",
            "role",
            "is_active",
            "is_verified",
            "created_at",
        ]
