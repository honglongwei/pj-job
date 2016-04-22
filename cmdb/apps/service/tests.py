# coding: utf-8
from libs.test import BaseTestCase
from apps.service.models import Project

class ServiceTest(BaseTestCase):

    def setUp(self):
        super(ServiceTest, self).setUp()

        project = Project(name = "移动_魔剑之刃")
        project.save()
        self.project_id = project.id

    def test_get(self):
        # 正常用例
        ret = self.service.cmdb.getServer(project_id = self.project_id, cache = False)
        self.assertEqual(ret["result"]["test"]["code"], 4)

        # 参数错误
        ret = self.service.cmdb.getServer(project_id = "a")
        self.assertEqual(ret["result"]["test"]["code"], 1)

    def test_project(self):
        ret = self.service.cmdb.getProject(project_id = [self.project_id])
        self.assertEqual(ret["result"]["test"]["code"], 4)
