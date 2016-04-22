#encoding: utf-8
from django.core.urlresolvers import reverse
from libs.test import BaseTestCase, ClientTest

class CmdbTest(BaseTestCase):
    def test_get(self):
        #正常用例
        url = reverse("api:cmdb.get")
        ret = self.client.post(url, {
                "project_id": self.project_id
            }).json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #参数错误
        ret = self.client.post(url, {
                "project_id": "asdf"
            }).json().get("test")
        self.assertEqual(ret.get("code"), 500)

class AuthTest(BaseTestCase):
    def setUp(self):
        """
        为了清空session 测试登录
        """
        self.client = ClientTest()

    def test_login(self):
        #正常用例
        url = reverse("api:auth.login")
        ret = self.client.post(url, {
                "username": "zhu",
                "password": "123456"
            }).json().get("test")
        self.assertEqual(ret.get("code"), 7)

        #参数错误
        ret = self.client.post(url, {
                "username": "zhu",
                "password": ""
            }).json().get("test")
        self.assertEqual(ret.get("code"), 500)

        #用户名或密码错误
        ret = self.client.post(url, {
                "username": "zhu",
                "password": "123123123"
            }).json().get("test")
        self.assertEqual(ret.get("code"), 3)

    def test_get(self):
        #用户登录
        self.test_login()
        
        #正常用例
        url = reverse("api:auth.get")
        ret = self.client.post(url).json().get("test")
        self.assertEqual(ret.get("code"), 7)
