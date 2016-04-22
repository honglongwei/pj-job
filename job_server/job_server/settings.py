#encoding: utf-8
import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "#!2c6wk0ys=9g8-^$#o+c-7-z$-+viep9cek=@wi(m72lv)l4x"

# SECURITY WARNING: don"t run with debug turned on in production!
DEBUG = False
UNITTEST = False
ALLOWED_HOSTS = ["*"]

# Application definition
INSTALLED_APPS = [
    "django.contrib.sessions",
    "apps.api",
    "apps.task",
    "apps.manage",
    "apps.history",
    "apps.engine",
    "apps.dashboard"
]

MIDDLEWARE_CLASSES = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "libs.middlewares.PostRequiredMiddleware",
    "libs.middlewares.LoginRequiredMiddleware",
    "libs.middlewares.FormMiddleware",
    "libs.middlewares.ProjectMiddleware",
    "libs.middlewares.LogMiddleware"
]

# Auth uri
AUTH = ""

# Cmdb uri
CMDB = ""

# Session Cache settings
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.MemcachedCache",
        "LOCATION": ""
    }
}
SESSION_ENGINE = "django.contrib.sessions.backends.cache"

# Database settings
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

# Log settings
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(asctime)s|%(levelname)s|%(message)s"
        }
    },
    "handlers": {
        "access": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": BASE_DIR + "/log/access.log",
            "formatter": "verbose"
        },
        "error": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": BASE_DIR + "/log/error.log",
            "formatter": "verbose"
        }
    },
    "loggers": {
        "access": {
            "handlers": ["access"],
            "level": "DEBUG",
            "propagate": False,
        },
        "error": {
            "handlers": ["error"],
            "level": "DEBUG",
            "propagate": False,
        }
    }
}

# Internationalization
ROOT_URLCONF = "job_server.urls"
WSGI_APPLICATION = "job_server.wsgi.application"
LANGUAGE_CODE = "en-us"
DEFAULT_CHARSET = "utf-8"
FILE_CHARSET = "utf-8"
TIME_ZONE = "Asia/Shanghai"
USE_I18N = True
USE_L10N = True
USE_TZ = False

# Celery settings
BROKER_URL = ""
CELERY_TASK_SERIALIZER = "msgpack"
CELERY_ACCEPT_CONTENT = ["msgpack"]
CELERYD_CONCURRENCY = 8
CELERYD_MAX_TASKS_PER_CHILD = 200
CELERY_REDIS_MAX_CONNECTIONS = 50