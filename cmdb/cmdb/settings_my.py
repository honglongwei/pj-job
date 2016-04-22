# encoding: utf-8
from settings import *

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "Cmdb",
        "USER": "cmdb",
        "PASSWORD": "asdf89234123j1k23093982323123ffff",
        "HOST": "127.0.0.1",
        "PORT": "3306"
    }
}

# Cache
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6380/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        }
    }
}
