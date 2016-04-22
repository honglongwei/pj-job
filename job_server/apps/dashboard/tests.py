#encoding: utf-8
from django.core.urlresolvers import reverse
from libs.test import BaseTestCase

class DashboardTest(BaseTestCase):
    def test_get(self):
        #创建任务
        user_id = self.util.addUser(project_id = self.project_id, name = "zhangsan")
        procedure = self.util.buildProcedure(user_id = user_id)
        for x in xrange(1, 5):
            ret = self.util.createTask(project_id = self.project_id, procedure = procedure)

        #正常用例
        url = reverse("dashboard:dashboard.get")
        ret = self.client.post(url, {
                "project_id": self.project_id,
        }).json().get("test")
        self.assertEqual(ret.get("code"), 3)

        #参数错误
        ret = self.client.post(url, {
                "project_id": "asdf",
        }).json().get("test")
        self.assertEqual(ret.get("code"), 500)