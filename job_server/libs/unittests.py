#encoding: utf-8
from django.http import HttpResponse
import simplejson
import random

def Ujsonify(*args, **kwargs):
    """
    通用返回json
    """
    return HttpResponse(
        simplejson.dumps(dict(*args, **kwargs), ensure_ascii = False),
        content_type = "application/json;charset = utf-8"
    )

def Uscript(id, hosts, content, type, user, args):
    """
    脚本执行逻辑
    """
    ret = {}

    num = random.randint(0, 100)
    if num > 50:
        for i in hosts:
            ret[i] = {
                "code": 0,
                "log": "unittest",
                "time": 10
            }

    else:
        for i in hosts:
            num = random.randint(0, 100)
            if num > 50:
                ret[i] = {
                    "code": 0,
                    "log": "unittest",
                    "time": 10
                }
            else:
                ret[i] = {
                    "code": 250,
                    "log": "unittest",
                    "time": 10
                }

    return ret

class UServiceProxy(object):
    """
    jsonrpc客户端
    """
    class UService(object):
        """
        服务实现
        """
        def auth_login(self, username, password):
            if password != "123456":
                return dict(success = False)

            data = {
                "user": {
                    "id": 1,
                    "username": "zhangsan"
                },
                "project": [1, 2, 3]
            }
            return dict(success = True, data = data)

        def auth_hasPermissionProject(self, project_id, user_id):
            return dict(success = True)

        def cmdb_getProject(self, project_id):
            return dict(success = True, data = [{"id": 1, "name": "test"}])

        def cmdb_isServersInProject(self, project_id, servers):
            return dict(success = True)

        def cmdb_getServer(self, project_id, cache):
            server = {
                "host": "192.168.1.1",
                "zone": "",
                "channel": "",
                "desc": "",
                "function": ""
            }  
            return dict(success = True, data = [server])

    def __init__(self, uri = None, method = None, version = "2.0"):
        self.method = method
        self.service = self.UService()

    def __getattr__(self, name):
        if self.method != None:
            name = "%s.%s" % (self.method, name)
        return self.__class__(method = name)

    def __call__(self, *args, **kwargs):
        ret = getattr(self.service, "_".join(self.method.split(".")))(**kwargs)
        return {"result": ret}