from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    # Allow the manager to be used during migrations
    use_in_migrations = True

    def create_user(
        self,
        email,
        username=None,
        password=None,
        **extra_fields
    ):
        # Validate required fields
        if not email:
            raise ValueError("Email is required.")

        if not username:
            raise ValueError("Username is required.")

        # Normalize the email before creating the user
        email = self.normalize_email(email)

        # Create the user object
        user = self.model(
            email=email,
            username=username,
            **extra_fields
        )

        # Hash the password and save the user
        user.set_password(password)
        user.save(using=self._db)

        return user
