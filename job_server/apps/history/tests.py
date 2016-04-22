#encoding: utf-8
from django.core.urlresolvers import reverse
from libs.test import BaseTestCase

class HistoryTest(BaseTestCase):
    def test_show(self):
        #创建任务
        user_id = self.util.addUser(project_id = self.project_id, name = "zhangsan")
        procedure = self.util.buildProcedure(user_id = user_id)
        for x in xrange(1, 5):
            ret = self.util.createTask(project_id = self.project_id, procedure = procedure)

        #正常用例
        url = reverse("history:history.show")
        ret = self.client.post(url, {
                "project_id": self.project_id,
                "start": 0,
                "limit": 10
        }).json().get("test")
        self.assertEqual(ret.get("total"), 4)

        url = reverse("history:history.show")
        ret = self.client.post(url, {
                "project_id": self.project_id + 1000,
                "start": 0,
                "limit": 10
        }).json().get("test")
        self.assertEqual(ret.get("total"), 0)

        #参数错误
        ret = self.client.post(url, {
                "project_id": self.project_id,
                "start": 0,
                "limit": "asdf"
        }).json().get("test")
        self.assertEqual(ret.get("code"), 500)

    def test_task(self):
        #创建任务
        user_id = self.util.addUser(project_id = self.project_id, name = "zhangsan")
        procedure = self.util.buildProcedure(user_id = user_id)
        ret = self.util.createTask(project_id = self.project_id, procedure = procedure)

        task_id = ret.get("id")

        #正常用例
        ret = self.util.getTask(project_id = self.project_id, task_id = task_id)
        self.assertEqual(ret.get("code"), 4)

        #参数错误
        ret = self.util.getTask(project_id = self.project_id, task_id = "asdf")
        self.assertEqual(ret.get("code"), 500)

        #未找到
        ret = self.util.getTask(project_id = self.project_id, task_id = task_id + 1000)
        self.assertEqual(ret.get("code"), 3)

    def test_node(self, url = reverse("history:history.getNode")):
        #创建任务
        user_id = self.util.addUser(project_id = self.project_id, name = "zhangsan")
        procedure = self.util.buildProcedure(user_id = user_id)
        ret = self.util.createTask(project_id = self.project_id, procedure = procedure)

        task_id = ret.get("id")
        ret = self.util.getTask(project_id = self.project_id, task_id = task_id)
        task = ret.get("task")

        node_id = task["steps"][0]["nodes"][0].get("id")

        #正常用例
        ret = self.client.post(url, {
                "project_id": 20,
                "node_id": node_id
        }).json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #未找到
        ret = self.client.post(url, {
                "project_id": 20,
                "node_id": node_id + 1000
        }).json().get("test")
        self.assertEqual(ret.get("code"), 3)

        #参数错误
        ret = self.client.post(url, {
                "project_id": 20,
                "node_id": "asf"
        }).json().get("test")
        self.assertEqual(ret.get("code"), 500)

    def test_step(self):
        self.test_node(url = reverse("history:history.getStep"))

    def test_server(self):
        #创建任务
        user_id = self.util.addUser(project_id = self.project_id, name = "zhangsan")
        procedure = self.util.buildProcedure(user_id = user_id)
        ret = self.util.createTask(project_id = self.project_id, procedure = procedure)

        server_id = ret.get("engine").get("servers").get("success")[0].get("id")

        #正常用例
        url = reverse("history:history.getServer")
        ret = self.client.post(url, {
                "project_id": self.project_id,
                "server_id": server_id
        }).json().get("test")
        self.assertEqual(ret.get("code"), 4)

        #参数错误
        ret = self.client.post(url, {
                "project_id": self.project_id,
                "server_id": "asdf"
        }).json().get("test")
        self.assertEqual(ret.get("code"), 500)

        #未找到
        ret = self.client.post(url, {
                "project_id": self.project_id,
                "server_id": server_id + 1000
        }).json().get("test")
        self.assertEqual(ret.get("code"), 3)

    def test_ignore(self, url = reverse("history:history.ignore")):
        #创建任务
        user_id = self.util.addUser(project_id = self.project_id, name = "zhangsan")
        procedure = self.util.buildProcedure(user_id = user_id)
        ret = self.util.createTask(project_id = self.project_id, procedure = procedure)

        task_id = ret.get("id")
        breakpoint = ret.get("engine").get("breakpoint")
        task_status = ret.get("engine").get("status")

        step_id = breakpoint.get("step_id")
        node_id = breakpoint.get("node_id")
        step_index = breakpoint.get("step_index")
        node_index = breakpoint.get("node_index")

        #正常用例
        while True:
            if task_status:
                break

            response = self.client.post(url, {
                    "project_id": self.project_id,
                    "task_id": task_id,
                    "step_id": step_id,
                    "node_id": node_id
                })

            ret = response.json().get("test")
            breakpoint = ret.get("engine").get("breakpoint")
            task_status = ret.get("engine").get("status")

            step_id = breakpoint.get("step_id")
            node_id = breakpoint.get("node_id")
            step_index = breakpoint.get("step_index")
            node_index = breakpoint.get("node_index")
        self.assertEqual(task_status, True)

        #参数错误
        ret = self.client.post(url, {
                "project_id": self.project_id,
                "task_id": task_id,
                "step_id": "asdf",
                "node_id": 1
            }).json().get("test")
        self.assertEqual(ret.get("code"), 500)

        #任务未找到
        ret = self.client.post(url, {
                "project_id": self.project_id,
                "task_id": 1000,
                "step_id": 1000,
                "node_id": 1000
            }).json().get("test")
        self.assertEqual(ret.get("code"), 3)

        #状态错误
        ret = self.client.post(url, {
                "project_id": self.project_id,
                "task_id": task_id,
                "step_id": 1,
                "node_id": 1
            }).json().get("test")
        self.assertEqual(ret.get("code"), 4)

    def test_retry(self):
        self.test_ignore(url = reverse("history:history.retry"))