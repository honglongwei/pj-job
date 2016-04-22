#encoding: utf-8
from django.core.urlresolvers import reverse
from libs.test import BaseTestCase
import json

class ProcedureTest(BaseTestCase):
    def setUp(self):
        super(ProcedureTest, self).setUp()
        user_id = self.util.addUser(project_id = self.project_id, name = "zhangsan")
        procedure = self.util.buildProcedure(user_id = user_id)
        self.user_id = user_id
        self.procedure = procedure
        self.json_procedure = json.dumps(procedure)

    def test_add(self):
        #正常用例
        url = reverse("task:procedure.add")
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure": self.json_procedure
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #表单参数错误用例
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure": str(self.procedure)
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 1)

        #用户名项目权限错误用例
        response = self.client.post(url, {
                "project_id": 100000,
                "procedure":  self.json_procedure
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 2)

        #脚本尺寸过大
        procedure = self.util.buildProcedure(user_id = self.user_id)
        procedure["steps"][0]["nodes"][0]["content"] = "1qaz2wsx" * 200000
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure": json.dumps(procedure)
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 2)

    def test_runTemp(self):
        #正常用例
        url = reverse("task:procedure.runTemp")
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure": self.json_procedure
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #表单参数错误用例
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure": str(self.procedure)
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 1)

        #用户名项目权限错误用例
        response = self.client.post(url, {
                "project_id": 100000,
                "procedure":  self.json_procedure
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 2)

    def test_run(self):
        procedure_id = self.util.addProcedure(project_id = self.project_id, procedure = self.json_procedure)

        #正常用例
        url = reverse("task:procedure.run")
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure_id": procedure_id
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #流程不存在
        response = self.client.post(url, {
                "project_id": 99999,
                "procedure_id": procedure_id
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 2)

    def test_show(self):
        self.util.addProcedure(project_id = self.project_id, procedure = self.json_procedure)

        #正常用例
        url = reverse("task:procedure.show")
        response = self.client.post(url, {
                "project_id": self.project_id,
            })
        ret = response.json().get("test")
        self.assertEqual(len(ret.get("data")), 1)
        self.assertEqual(ret.get("code"), 4)

    def test_delete(self):
        procedure_id = self.util.addProcedure(project_id = self.project_id, procedure = self.json_procedure)

        #正常用例
        url = reverse("task:procedure.delete")
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure_id": procedure_id
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #未找到
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure_id": 9999
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 2)

    def test_save(self):
        procedure_id = self.util.addProcedure(project_id = self.project_id, procedure = self.json_procedure)

        new_procedure = self.procedure
        new_procedure["name"] = "改了"
        post_data = {
            "project_id": self.project_id,
            "procedure_id": procedure_id,
            "procedure": json.dumps(new_procedure)
        }

        #正常用例
        url = reverse("task:procedure.save")
        response = self.client.post(url, post_data)
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #表单错误用例
        post_data["procedure"] = self.procedure
        response = self.client.post(url, post_data)
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 1)

        #未找到
        post_data["project_id"] = 9999
        post_data["procedure"] = self.json_procedure
        response = self.client.post(url, post_data)
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 2)

    def test_get(self):
        procedure_id = self.util.addProcedure(project_id = self.project_id, procedure = self.json_procedure)

        #正常用例
        url = reverse("task:procedure.get")
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure_id": procedure_id
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #未找到
        response = self.client.post(url, {
                "project_id": self.project_id,
                "procedure_id": 9999
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 1)

    def test_search(self):
        procedure_id = self.util.addProcedure(project_id = self.project_id, procedure = self.json_procedure)

        #正常用例
        url = reverse("task:procedure.search")
        response = self.client.post(url, {
                "project_id": self.project_id,
                "name": self.procedure.get("name")
            })
        ret = response.json().get("test")
        self.assertEqual(ret.get("code"), 4)
