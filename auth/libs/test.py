#encoding: utf-8
from django.core.urlresolvers import reverse
from django.test import TestCase, Client
from jsonrpc.proxy import TestingServiceProxy
import simplejson as json

class ClientTest(Client):
    """
    Http客户端实现 用于单元测试
    """
    def _parse_json(self, response, **extra):
        """
        django自带的有问题,重写之
        """
        if "application/json" not in response.get("Content-Type"):
            raise ValueError(
                """Content-Type header is "{0}", not "application/json" """
                .format(response.get("Content-Type"))
            )
        return json.loads(response.content.decode(encoding = "utf-8"), **extra)

class BaseTestCase(TestCase):
    """
    单元测试基类
    """
    def setUp(self):
        self.client = ClientTest()
        self.service = TestingServiceProxy(self.client, reverse("service:jsonrpc_site"), version = "2.0")
