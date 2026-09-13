from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os


# ============================================================
# BASE
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


# ============================================================
# SECURITY
# ============================================================

SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = os.getenv("DEBUG", "False").lower() == "true"


# ============================================================
# HOSTS
# ============================================================

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "https://sociala-frontend.vercel.app/",
    os.getenv("LAN_IP", "192.168.18.9"),
    "sociala-backend.onrender.com"
]


# ============================================================
# FRONTEND URLS
# ============================================================

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://sociala-frontend.vercel.app/",
)

FRONTEND_LAN_URL = os.getenv(
    "FRONTEND_LAN_URL",
    "http://192.168.18.9:5173",
)


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [

    # --------------------------------------------------------
    # Django
    # --------------------------------------------------------

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # --------------------------------------------------------
    # Third-party
    # --------------------------------------------------------

    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist",

    # --------------------------------------------------------
    # Local apps
    # --------------------------------------------------------

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

    # CORS must be near the top
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

    # React on computer
    FRONTEND_URL,

    # React on phone through LAN
    FRONTEND_LAN_URL,
]

CORS_ALLOW_CREDENTIALS = True


# ============================================================
# CSRF
# ============================================================

CSRF_TRUSTED_ORIGINS = [

    # React on computer
    FRONTEND_URL,

    # React on phone through LAN
    FRONTEND_LAN_URL,
    
     "https://sociala-backend.onrender.com",
]


# ============================================================
# DATABASE - POSTGRESQL
# ============================================================

DATABASES = {

    "default": {

        "ENGINE": "django.db.backends.postgresql",

        "NAME": os.getenv("DB_NAME"),

        "USER": os.getenv("DB_USER"),

        "PASSWORD": os.getenv("DB_PASSWORD"),

        "HOST": os.getenv(
            "DB_HOST",
            "localhost",
        ),

        "PORT": os.getenv(
            "DB_PORT",
            "5432",
        ),
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

    # Access token expires after 15 minutes
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=15
    ),

    # Refresh token expires after 7 days
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=7
    ),

    # Generate a new refresh token when refreshing
    "ROTATE_REFRESH_TOKENS": True,

    # Blacklist the old refresh token
    "BLACKLIST_AFTER_ROTATION": True,
}


# ============================================================
# JWT HTTP-ONLY COOKIES
# ============================================================

AUTH_COOKIE_ACCESS = "access_token"

AUTH_COOKIE_REFRESH = "refresh_token"


# Prevent JavaScript from accessing JWT cookies
AUTH_COOKIE_HTTP_ONLY = True


# ------------------------------------------------------------
# Local development
# ------------------------------------------------------------
# False because you are using HTTP.
#
# Production with HTTPS:
# AUTH_COOKIE_SECURE = True
# ------------------------------------------------------------

AUTH_COOKIE_SECURE = False


# ------------------------------------------------------------
# Cookie SameSite policy
# ------------------------------------------------------------

AUTH_COOKIE_SAMESITE = "Lax"


# ============================================================
# EMAIL - BREVO SMTP
# ============================================================

EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
)

EMAIL_HOST = os.getenv(
    "EMAIL_HOST",
    "smtp-relay.brevo.com",
)

EMAIL_PORT = int(
    os.getenv(
        "EMAIL_PORT",
        "587",
    )
)

EMAIL_HOST_USER = os.getenv(
    "EMAIL_HOST_USER"
)

EMAIL_HOST_PASSWORD = os.getenv(
    "EMAIL_HOST_PASSWORD"
)

EMAIL_USE_TLS = (
    os.getenv(
        "EMAIL_USE_TLS",
        "True",
    ).lower()
    == "true"
)

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
# Media
# ============================================================
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ============================================================
# DEFAULT PRIMARY KEY
# ============================================================

DEFAULT_AUTO_FIELD = (
    "django.db.models.BigAutoField"
)