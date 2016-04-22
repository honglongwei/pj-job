#encoding: utf-8
from django.conf import settings
from django.core.cache import cache
from libs.common import encrypt
import urllib
import urllib2
import simplejson

class SealService(object):
    uri = settings.SEAL
    uri_yun = settings.SEAL_YUN
    header = {"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)"}

    def getServer(self, cache = True, **kwargs):
        if cache:
            data = self.__getCache(**kwargs)
            if data:
                return data

        ret = []

        req = urllib2.Request(self.uri, urllib.urlencode(kwargs), self.header)
        res = urllib2.urlopen(req)
        data = simplejson.loads(res.read())

        req = urllib2.Request(self.uri_yun, urllib.urlencode(kwargs), self.header)
        res = urllib2.urlopen(req)
        yun_data = simplejson.loads(res.read())

        if data:
            ret.extend(data)
        if yun_data:
            ret.extend(yun_data)

        self.__setCache(ret, **kwargs)
        return ret

    def __getCache(self, **kwargs):
        key = encrypt(str(kwargs))
        data = cache.get(key)
        return data if data else None

    def __setCache(self, data, **kwargs):
        key = encrypt(str(kwargs))
        cache.set(key, data, timeout = None)
