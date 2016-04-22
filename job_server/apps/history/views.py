# encoding: utf-8
from libs.common import jsonify, humanReadableDate, query, dcompress
from libs.forms import QueryForm
from apps.history.forms import HistoryTaskForm, HistoryNodeForm, HistoryServerForm, HistoryGetForm, HandleForm
from apps.history.models import HistoryTask, HistoryStep, HistoryScriptNode, HistoryScriptServer
from apps.history.services import do_getProcedure, do_resumeTask, ignoreHandler, retryHandler, StatusErrorException, NotFoundException
from apps.engine.tasks import execute

def getTask(request, validator = HistoryTaskForm):
    """
    获取任务历史数据
    """
    project_id = request.formdata.get("project_id")
    task_id = request.formdata.get("task_id")

    try:
        task = HistoryTask.objects.get(id = task_id, project_id = project_id)
    except Exception:
        return jsonify(test = {"code": 3}, success = False, msg = u"未找到任务记录")

    data = {}
    data["name"] = task.name
    data["status"] = task.status
    data["user"] = task.user
    data["total_time"] = task.total_time
    data["start_time"] = humanReadableDate(task.start_time)
    data["end_time"] = humanReadableDate(task.end_time)
    steps = []
    step_objs = HistoryStep.objects.filter(task_id = task_id)
    for step in step_objs:
        step_ = {}
        step_["id"] = step.id
        step_["name"] = step.name
        step_["type"] = step.type
        nodes = []
        node_objs = HistoryScriptNode.objects.filter(step_id = step.id)
        for node in node_objs:
            node_ = {}
            node_["id"] = node.id
            node_["name"] = node.name
            node_["start_time"] = humanReadableDate(node.start_time)
            node_["end_time"] = humanReadableDate(node.end_time)
            node_["total_time"] = node.total_time
            node_["status"] = node.status
            node_["num"] = node.historyscriptserver_set.count()
            nodes.append(node_)
        step_["nodes"] = nodes
        steps.append(step_)
    data["steps"] = steps

    return jsonify(test = {"code": 4, "task": data}, success = True, data = data)

def getNode(request, validator = HistoryNodeForm):
    """
    获取节点历史数据
    """
    project_id = request.formdata.get("project_id")
    node_id = request.formdata.get("node_id")

    try:
        node = HistoryScriptNode.objects.get(id = node_id)
    except Exception:
        return jsonify(test = {"code": 3}, success = False, msg = u"未找到节点记录")

    data = {}
    data["id"] = node.id
    data["name"] = node.name
    data["user"] = node.user
    data["type"] = 1
    data["start_time"] = humanReadableDate(node.start_time)
    data["end_time"] = humanReadableDate(node.end_time)
    data["total_time"] = node.total_time
    data["status"] = node.status

    servers = []
    server_objs = HistoryScriptServer.objects.filter(node_id = node_id)
    for obj in server_objs:
        server = {}
        server["id"] = obj.id
        server["host"] = obj.host
        server["code"] = obj.code
        server["total_time"] = obj.total_time
        servers.append(server)
    data["servers"] = servers

    return jsonify(test = {"code": 4}, success = True, data = data)

def getServer(request, validator = HistoryServerForm):
    """
    获取服务器执行结果数据
    """
    project_id = request.formdata.get("project_id")
    server_id = request.formdata.get("server_id")

    try:
        server = HistoryScriptServer.objects.get(id = server_id)
    except Exception:
        return jsonify(test = {"code": 3}, success = False, msg = u"未找到服务器")

    log = dcompress(server.log)
    return jsonify(test = {"code": 4}, success = True, data = log)

def getStep(request, validator = HistoryNodeForm):
    """
    获取步骤详情数据
    """
    project_id = request.formdata.get("project_id")
    node_id = request.formdata.get("node_id")

    try:
       node = HistoryScriptNode.objects.values("args", "type", "content").get(id = node_id)
    except:
        return jsonify(test = {"code": 3}, success = False, msg = u"未找到节点记录")

    args = node.get("args")
    type = node.get("type")
    content = dcompress(node.get("content"))

    data = {
        "args": args,
        "type": type,
        "content": content
    }

    return jsonify(test = {"code": 4}, success = True, data = data)

def show(request, validator = HistoryGetForm):
    """
    获取任务历史列表
    """
    project_id = request.formdata.get("project_id")
    start = request.formdata.get("start")
    limit = request.formdata.get("limit")

    tasks_total = HistoryTask.objects.filter(project_id = project_id).count()
    tasks = HistoryTask.objects.filter(project_id = project_id).order_by("-start_time")[start:start + limit]
    data = list(tasks.values())

    if data:
        for task in data:
            task["start_time"] = humanReadableDate(task["start_time"])
            task["end_time"] = humanReadableDate(task["end_time"])

    return jsonify(test = {"total": tasks_total}, success = True, total = tasks_total, data = data)

def ignore(request, validator = HandleForm):
    """
    忽略错误继续执行
    """
    project_id = request.formdata.get("project_id")
    task_id = request.formdata.get("task_id")
    step_id = request.formdata.get("step_id")
    node_id = request.formdata.get("node_id")

    try:
        task = do_resumeTask(do_getProcedure(project_id, task_id), step_id, node_id, handler = ignoreHandler)
    except NotFoundException:
        return jsonify(test = {"code": 3}, success = False, msg = u"忽略错误失败")
    except StatusErrorException:
        return jsonify(test = {"code": 4}, success = False, msg = u"忽略错误失败")

    ret = execute(task = task)

    return jsonify(test = {"engine": ret}, success = True, msg = u"流程继续执行")

def retry(request, validator = HandleForm):
    """
    失败主机重试
    """
    project_id = request.formdata.get("project_id")
    task_id = request.formdata.get("task_id")
    step_id = request.formdata.get("step_id")
    node_id = request.formdata.get("node_id")

    try:
        task = do_resumeTask(do_getProcedure(project_id, task_id), step_id, node_id, handler = retryHandler)
    except NotFoundException:
        return jsonify(test = {"code": 3}, success = False, msg = u"忽略错误失败")
    except StatusErrorException:
        return jsonify(test = {"code": 4}, success = False, msg = u"忽略错误失败")

    ret = execute(task = task)

    return jsonify(test = {"engine": ret}, success = True, msg = u"流程继续执行")

def search(request, validator = QueryForm):
    """
    查询历史
    """
    success, data, msg = query(request.formdata, HistoryTask)
    return jsonify(test = {"code": 2}, success = True, data = data, msg = msg)
