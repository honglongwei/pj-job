#encoding: utf-8
from settings import *

CMDB = "http://localhost:8082/jsonrpc"

AUTH = "http://127.0.0.1:8081/jsonrpc"

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.MemcachedCache",
        "LOCATION": "127.0.0.1:11211"
    }
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "Job",
        "USER":"job",
        "PASSWORD":"asdf89234123j1k230939823",
        "HOST":"127.0.0.1",
        "PORT":"3306"
    }
}

BROKER_URL = "redis://localhost:6379/0"
CELERYD_CONCURRENCY = 256
