#encoding: utf-8
from apps.task.models import Procedure
from apps.manage.models import Script, User
from libs.permissions import isServersInProject
from libs.common import compress
import sys

class KnownException(Exception):
    pass

def procedureCheck(project_id, procedure, check_unique = False):
    """
    流程数据结构检查
    """
    success = False
    msg = ""
    procedure_checked = {}

    script_names = [x.get("name") for x in Script.objects.values("name").filter(project_id = project_id)]
    users_map = {}
    for user in User.objects.filter(project_id = project_id):
        users_map[user.id] = user

    try:
        procedure = dict(procedure)

        t_name = unicode(procedure["name"].strip())
        if not t_name:
            raise KnownException(u"流程名不能为空")
        if len(t_name) > 200:
            raise KnownException(u"流程名不能超过200字符")
        if check_unique:
            if Procedure.objects.filter(name = t_name, project_id = project_id).exists():
                raise KnownException(u"流程名已存在")

        procedure_checked["name"] = t_name

        steps = []
        t_steps = list(procedure.get("steps"))
        for step_x, step_y in enumerate(t_steps):
            step = {}
            t_step = dict(step_y)

            t_step_name = unicode(t_step["name"].strip())
            if not t_step_name:
                raise KnownException(u"步骤名不能为空")
            if len(t_step_name) > 200:
                raise KnownException(u"流程名不能超过200字符")

            t_type = int(t_step["type"])
            if t_type not in [1, 2]:
                raise KnownException(u"步骤类型不正确")

            step["name"] = t_step_name
            step["index"] = step_x
            step["type"] = t_type

            nodes = []
            t_nodes = list(t_step["nodes"])
            for node_x, node_y in enumerate(t_nodes):
                node = {}
                t_node = dict(node_y)

                t_node_name = unicode(t_node["name"].strip())
                if not t_node_name:
                    raise KnownException(u"脚本名称不能为空")
                if len(t_node_name) > 200:
                    raise KnownException(u"脚本名不能超过200字符")
                if check_unique:
                    if t_node_name in script_names:
                        raise KnownException(u"脚本名已存在")

                script_names.append(t_node_name)
                t_node_content = unicode(t_node["content"].strip())
                if not t_node_content:
                    raise KnownException(u"脚本{name}不能为空".format(name = t_node_name))
                if sys.getsizeof(t_node_content)/1024 > 50:
                    raise KnownException(u"脚本{name}不能超过50KB".format(name = t_node_name))

                t_node_user = int(t_node["user"])
                if t_node_user not in users_map:
                    raise KnownException(u"用户不存在")

                t_node_type = int(t_node["type"])
                if t_node_type not in [1, 2, 3]:
                    raise KnownException(u"脚本类型错误")

                t_node_args = unicode(t_node["args"].strip())
                if len(t_node_args) > 200:
                    raise KnownException(u"脚本参数不能超过200字符")

                t_node_servers = [unicode(x.strip()) for x in set(t_node["servers"])]
                if not t_node_servers:
                    raise KnownException(u"服务器列表不能为空")
                if not isServersInProject(t_node_servers, project_id):
                    raise KnownException(u"非法服务器权限")

                node["name"] = t_node_name
                node["content"] = compress(t_node_content)
                node["args"] = t_node_args
                node["user"] = users_map.get(t_node_user)
                node["type"] = t_node_type
                node["index"] = node_x
                node["servers"] = "|".join(t_node_servers)
                nodes.append(node)

            step["nodes"] = nodes
            steps.append(step)
        procedure_checked["steps"] = steps

    except KnownException as e:
        msg = e.message
    except Exception:
        msg = u"流程数据结构错误"
    else:
        success = True

    return success, msg, procedure_checked