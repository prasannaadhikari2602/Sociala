from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file for local development
load_dotenv(BASE_DIR / ".env")


# ============================================================
# SECURITY
# ============================================================

SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG", "False").lower() == "true"


# ============================================================
# ALLOWED HOSTS
# ============================================================

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    os.getenv("LAN_IP", "192.168.18.9"),
    "sociala-backend.onrender.com",
]


# ============================================================
# FRONTEND URLS
# ============================================================

# Production React frontend
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://sociala-frontend.vercel.app",
)

# Local React frontend
FRONTEND_LAN_URL = os.getenv(
    "FRONTEND_LAN_URL",
    "http://192.168.18.9:5173",
)


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "cloudinary_storage",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist",
    "cloudinary",

    # Local apps
    "apps.accounts.apps.AccountsConfig",
    "apps.profiles.apps.ProfilesConfig",
    "apps.reports.apps.ReportsConfig",
    "apps.follows.apps.FollowsConfig",
    "apps.posts.apps.PostsConfig",
    "apps.notifications.apps.NotificationsConfig",
    "apps.shares.apps.SharesConfig",
]


# ============================================================
# CUSTOM USER MODEL
# ============================================================

AUTH_USER_MODEL = "accounts.User"


# ============================================================
# MIDDLEWARE
# ============================================================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================
# URL / WSGI
# ============================================================

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"


# ============================================================
# TEMPLATES
# ============================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ============================================================
# CORS
# ============================================================

CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
    FRONTEND_LAN_URL,
]

# Required because JWT cookies are sent with requests
CORS_ALLOW_CREDENTIALS = True


# ============================================================
# CSRF
# ============================================================

CSRF_TRUSTED_ORIGINS = [
    FRONTEND_URL,
    FRONTEND_LAN_URL,
]


# ============================================================
# DATABASE - POSTGRESQL / SUPABASE
# ============================================================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
        "OPTIONS": {
            "sslmode": "require",
        },
        "DISABLE_SERVER_SIDE_CURSORS": True,
    }
}


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# ============================================================
# DJANGO REST FRAMEWORK
# ============================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.accounts.authentication.CookieJWTAuthentication",
    ],

    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}


# ============================================================
# SIMPLE JWT
# ============================================================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),

    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),

    "ROTATE_REFRESH_TOKENS": True,

    "BLACKLIST_AFTER_ROTATION": True,
}


# ============================================================
# JWT COOKIE SETTINGS
# ============================================================

AUTH_COOKIE_ACCESS = "access_token"

AUTH_COOKIE_REFRESH = "refresh_token"

AUTH_COOKIE_HTTP_ONLY = True

# Local:
#     DEBUG=True  -> False
#
# Render:
#     DEBUG=False -> True
#
# This is required for HTTPS cookies in production.
AUTH_COOKIE_SECURE = not DEBUG

# Required for cross-site requests between:
# Vercel -> Render
AUTH_COOKIE_SAMESITE = "None"


# ============================================================
# EMAIL - BREVO HTTP API
# ============================================================
#
# IMPORTANT: Transactional email is sent via Brevo's HTTPS API
# (see apps/accounts/utils.py -> send_transactional_email),
# NOT through Django's SMTP email backend.
#
# Render's free web service tier blocks outbound traffic on
# SMTP ports (25, 465, 587), so the SMTP backend times out in
# production even though it works locally. The HTTP API uses a
# normal HTTPS request instead, so it is unaffected.
#
# Required env var:
#   BREVO_API_KEY -> Brevo dashboard: SMTP & API -> API Keys tab
#                    (this is different from the SMTP
#                    username/password used previously)
# ============================================================

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL"
)


# ============================================================
# INTERNATIONALIZATION
# ============================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kathmandu"

USE_I18N = True

USE_TZ = True


# ============================================================
# STATIC FILES
# ============================================================

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


# ============================================================
# MEDIA FILES
# ============================================================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"

# ============================================================
# CLOUDINARY (IMAGE STORAGE)
# ============================================================

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": os.getenv("CLOUDINARY_API_KEY"),
    "API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
}

STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}
# ============================================================
# DEFAULT PRIMARY KEY
# ============================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ============================================================
# LOGGING
# ============================================================

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}