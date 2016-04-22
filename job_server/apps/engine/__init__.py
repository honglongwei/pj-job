#encoding: utf-8
from django.conf import settings
from celery import Celery, platforms

engine = Celery("engine")

platforms.C_FORCE_ROOT = True
engine.conf.update(
    CELERY_TIMEZONE = settings.TIME_ZONE,
    BROKER_URL = settings.BROKER_URL,
    CELERYD_CONCURRENCY = settings.CELERYD_CONCURRENCY,
    CELERYD_MAX_TASKS_PER_CHILD = settings.CELERYD_MAX_TASKS_PER_CHILD,
    CELERY_REDIS_MAX_CONNECTIONS = settings.CELERY_REDIS_MAX_CONNECTIONS,
    CELERY_ACCEPT_CONTENT = settings.CELERY_ACCEPT_CONTENT,
    CELERY_TASK_SERIALIZER = settings.CELERY_TASK_SERIALIZER
)