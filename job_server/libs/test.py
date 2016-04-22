#encoding: utf-8
import simplejson as json
from django.test import TestCase, Client
from django.core.urlresolvers import reverse
import uuid

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

class TestUtil(object):
    def __init__(self, client):
        self.client = client

    def addUser(self, project_id, name):
        ret = self.client.post(reverse("manage:user.add"), {
                "project_id": project_id,
                "name": name
            }).json().get("test")
        return ret.get("id")

    def addProcedure(self, project_id, procedure):
        ret = self.client.post(reverse("task:procedure.add"), {
                "project_id": project_id,
                "procedure": procedure
            }).json().get("test")
        return ret.get("id")

    def createTask(self, project_id, procedure):
        ret = self.client.post(reverse("task:procedure.runTemp"), {
                "project_id": project_id,
                "procedure": json.dumps(procedure)
            }).json().get("test")
        return ret

    def getTask(self, project_id, task_id):
        ret = self.client.post(reverse("history:history.getTask"), {
                "project_id": project_id,
                "task_id": task_id
        }).json().get("test")
        return ret

    def buildProcedure(self, user_id):
        servers = []

        for i in xrange(1, 10):
            servers.append("192.168.1." + str(i))

        procedure = {
            "name": "测试流程_" + str(uuid.uuid1()),
            "steps": []
        }

        for i in xrange(1, 5):
            step = {
                "name": "步骤" + str(i),
                "type": 1,
                "nodes": []
            }
            for j in xrange(1, 5):
                node = {
                    "name": "脚本" + str(j) + "_" + str(uuid.uuid1()),
                    "type": 1,
                    "user": user_id,
                    "args": "test",
                    "content": "ls /tmp",
                    "servers": servers
                }
                step["nodes"].append(node)

            procedure["steps"].append(step)

        return procedure

class BaseTestCase(TestCase):
    """
    单元测试基类
    """
    project_id = 1

    def setUp(self):
        self.client = ClientTest()
        self.util = TestUtil(self.client)

        session = self.client.session
        session["username"] = "konglw"
        session.save()