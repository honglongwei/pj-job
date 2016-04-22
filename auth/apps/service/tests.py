#encoding: utf-8
from libs.test import BaseTestCase
from apps.service.models import User, Project

class AuthTest(BaseTestCase):
    def setUp(self):
        super(AuthTest, self).setUp()

        user = User()
        user.username = "test1"
        user.password = "25d55ad283aa400af464c76d713c07ad"
        user.save()
        self.uid = user.id

        project = Project()
        project.user_id = user.id
        project.project_id = 1
        project.save()

        project = Project()
        project.user_id = user.id
        project.project_id = 2
        project.save()

    def test_login(self):
        #正常用例
        ret = self.service.auth.login(username = "test1", password = "12345678")
        result = ret["result"]
        self.assertEqual(result["test"]["code"], 4)

        #参数错误
        ret = self.service.auth.login(username = "test1", password = "")
        result = ret["result"]
        self.assertEqual(result["test"]["code"], 1)

        #用户不存在
        ret = self.service.auth.login(username = "test", password = "12311111111111")
        result = ret["result"]
        self.assertEqual(result["test"]["code"], 2)

        #密码错误
        ret = self.service.auth.login(username = "test1", password = "12311111111111")
        result = ret["result"]
        self.assertEqual(result["test"]["code"], 3)

    def test_auth(self):
        #正常用例
        ret = self.service.auth.hasPermissionProject(user_id = self.uid, project_id = "1")
        result = ret["result"]
        self.assertEqual(result["test"]["code"], 3)

        #参数错误
        ret = self.service.auth.hasPermissionProject(user_id = "zc", project_id = "zc")
        result = ret["result"]
        self.assertEqual(result["test"]["code"], 1)

        #用户无权限
        ret = self.service.auth.hasPermissionProject(user_id = self.uid, project_id = "5")
        result = ret["result"]
        self.assertEqual(result["test"]["code"], 2)

