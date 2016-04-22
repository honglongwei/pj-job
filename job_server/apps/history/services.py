#encoding: utf-8
from apps.history.models import HistoryTask, HistoryStep, HistoryScriptNode, HistoryScriptServer

class StatusErrorException(Exception):
    """
    状态检查错误异常
    """
    pass

class NotFoundException(Exception):
    """
    记录未找到
    """
    pass

def ignoreHandler(task):
    """
    忽略错误节点处理函数
    """
    task = task.copy()

    steps = task["steps"]
    nodes = steps[0]["nodes"]
    node = nodes.pop(0)

    HistoryScriptNode.objects.filter(id = node.get("id")).update(status = 3)
    if len(nodes) == 0:
        steps.pop(0)

    return task

def retryHandler(task):
    """
    重试错误节点处理函数
    """
    task = task.copy()

    steps = task["steps"]
    nodes = steps[0]["nodes"]
    node = nodes[0]

    server_objs = HistoryScriptServer.objects.values("id", "host").filter(node_id = node.get("id")).exclude(code = 0)
    servers = {}
    for server in list(server_objs):
        servers[server.get("host")] = server.get("id")

    nodes[0]["servers"] = servers

    return task

def do_getProcedure(project_id, task_id):
    """
    通过历史重建procedure结构
    """
    procedure = {}
    
    try:
        task = HistoryTask.objects.get(id = task_id, project_id = project_id)
    except Exception:
        raise NotFoundException

    procedure["id"] = task.id
    procedure["status"] = task.status

    steps = []
    step_objs = HistoryStep.objects.filter(task_id = task_id)
    for step_ in step_objs:
        step = {}
        step["id"] = step_.id
        step["name"] = step_.name
        step["type"] = step_.type
        step["index"] = step_.index

        nodes = []
        node_objs = HistoryScriptNode.objects.filter(step_id = step_.id)
        for node_ in node_objs:
            node = {}
            node["id"] = node_.id
            node["order"] = node_.order
            node["name"] = node_.name
            node["type"] = node_.type
            node["index"] = node_.index
            node["args"] = node_.args
            node["user"] = node_.user
            node["content"] = node_.content
            node["status"] = node_.status

            server_objs = HistoryScriptServer.objects.values("id", "host").filter(node_id = node_.id)
            node["servers"] = list(server_objs)
            nodes.append(node)
        step["nodes"] = nodes
        steps.append(step)

    procedure["steps"] = steps
    return procedure

def do_resumeTask(procedure, step_id, node_id, handler = None):
    """
    断点重构task结构
    """
    breakpoint = False

    if procedure["status"] != 2:
        raise StatusErrorException()

    task = {}
    task["id"] = procedure["id"]

    steps = []
    for step_ in procedure["steps"]:
        step = {}
        step["id"] = step_["id"]
        step["type"] = step_["type"]
        step["index"] = step_["index"]

        nodes = []
        for node_ in step_["nodes"]:
            if step_["id"] == step_id and node_["id"] == node_id:
                if node_["status"] != 2:
                    raise StatusErrorException()

                breakpoint = True

            else:
                if breakpoint:
                    if node_["status"] != 0:
                        raise StatusErrorException()

                else:
                    if node_["status"] not in [1, 3]:
                        raise StatusErrorException()
                    continue

            node = {}
            node["id"] = node_["id"]
            node["order"] = node_["order"]
            node["args"] = node_["args"]
            node["content"] = node_["content"]
            node["type"] = node_["type"]
            node["index"] = node_["index"]
            node["user"] = node_["user"]

            servers = {}
            for server in node_["servers"]:
                servers[server.get("name")] = server.get("id")

            node["servers"] = servers
            nodes.append(node)

        if nodes:
            step["nodes"] = nodes
            steps.append(step)

    if not breakpoint:
        raise StatusErrorException()

    task["steps"] = steps

    return handler(task) if handler else task