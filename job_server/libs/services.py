#encoding: utf-8
from django.conf import settings
from jsonrpc.proxy import ServiceProxy
from libs import unittests
import simplejson

def getService(uri):
    """
    jsonrpc 2.0协议标准
    """
    return ServiceProxy(uri, version = "2.0")

def getCmdbService():
    CMDB = settings.CMDB
    return getService(CMDB)

def getAuthService():
    AUTH = settings.AUTH
    return getService(AUTH)

ServiceProxy = unittests.UServiceProxy if settings.UNITTEST else ServiceProxy