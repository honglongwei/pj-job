#encoding: utf-8
#用于单元测试
from settings import *

UNITTEST = True

# Database settings
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:"
    }
}

# Session Cache settings
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.MemcachedCache",
        "LOCATION": "127.0.0.1:11211"
    }
}

# Log settings
LOGGING = None