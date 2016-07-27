#encoding: utf-8
import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "od!5#(48zy4v$--*b1z4$1^!3rggg9pq5(ix*%6uzec1$3hb@p"

# SECURITY WARNING: don"t run with debug turned on in production!
DEBUG = False
UNITTEST = False
ALLOWED_HOSTS = ["*"]

# Application definition
INSTALLED_APPS = [
    "apps.service"
]

MIDDLEWARE_CLASSES = [
    "django.middleware.common.CommonMiddleware"
]

# 资产接口
SEAL = "http://www.baidu.com/assetInfo"
SEAL_YUN = "http://www.baidu.com/cloudAsset"

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "",
        "USER": "",
        "HOST": "",
        "PORT": "",
        "PASSWORD": ""
    }
}

# Cache
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        }
    }
}

# Internationalization
ROOT_URLCONF = "cmdb.urls"
LANGUAGE_CODE = "en-us"
DEFAULT_CHARSET = "utf-8"
FILE_CHARSET = "utf-8"
WSGI_APPLICATION = "cmdb.wsgi.application"
TIME_ZONE = "Asia/Shanghai"
USE_I18N = True
USE_L10N = True
USE_TZ = False
