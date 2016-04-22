#encoding: utf-8
import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "ty^m&f-k1y7t52%#$r5qy51(l^x#452(_c#8dng#$hb&f=up(7"

# SECURITY WARNING: don"t run with debug turned on in production!
DEBUG = False
UNITTEST = False
ALLOWED_HOSTS = ["*"]

# Application definition
INSTALLED_APPS = [
    "django.contrib.sessions",
    "apps.service"
]

MIDDLEWARE_CLASSES = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware"
]

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "",
        "USER": "",
        "PASSWORD": "",
        "HOST": "",
        "PORT": ""
    }
}

# Internationalization
ROOT_URLCONF = "auth.urls"
WSGI_APPLICATION = "auth.wsgi.application"
LANGUAGE_CODE = "en-us"
DEFAULT_CHARSET = "utf-8"
FILE_CHARSET = "utf-8"
TIME_ZONE = "Asia/Shanghai"
USE_I18N = True
USE_L10N = True
USE_TZ = False