#encoding: utf-8
from libs.common import jsonify, json, humanReadableDate, query, dcompress
from libs.forms import ProjectForm, QueryForm
from apps.task.forms import ProcedureGetForm, ProcedureAddForm, ProcedureSaveForm
from apps.task.common.check import procedureCheck
from apps.task.services import do_addProcedure, do_deleteProcedure, do_createTask
from apps.task.models import Step, Procedure, ScriptNode
from apps.engine.tasks import execute

def add(request, validator = ProcedureAddForm):
    """
    新建流程
    """
    project_id = request.formdata.get("project_id")
    procedure = request.formdata.get("procedure")

    try:
        procedure_dict = json.loads(procedure)
    except Exception:
        return jsonify(test = {"code": 1}, success = False, msg = u"表单数据格式错误")

    success, msg, procedure_checked = procedureCheck(project_id, procedure_dict, check_unique = True)
    if not success:
        return jsonify(test = {"code": 2}, success = False, msg = msg)

    me = request.session.get("username")
    procedure_id = do_addProcedure(me, project_id, procedure_checked)

    return jsonify(test = {"code": 4, "id": procedure_id}, success = True, msg = u"添加成功")

def runTemp(request, validator = ProcedureAddForm):
    """
    临时流程执行
    """
    project_id = request.formdata.get("project_id")
    procedure = request.formdata.get("procedure")

    try:
        procedure_dict = json.loads(procedure)
    except Exception:
        return jsonify(test = {"code": 1}, success = False, msg = u"表单数据格式错误")

    success, msg, procedure_checked = procedureCheck(project_id, procedure_dict)
    if not success:
        return jsonify(test = {"code": 2}, success = False, msg = msg)

    me = request.session.get("username")
    task = do_createTask(project_id, me, procedure_checked)

    ret = execute(task = task)

    return jsonify(test = {"code": 4, "engine": ret, "id": task.get("id")}, success = True, data = task.get("id"))

def run(request, validator = ProcedureGetForm):
    """
    流程执行
    """
    project_id = request.formdata.get("project_id")
    procedure_id = request.formdata.get("procedure_id")

    try:
        procedure = Procedure.objects.get(id = procedure_id, project_id = project_id)
    except Exception:
        return jsonify(test = {"code": 2}, success = False, msg = u"流程不存在")

    procedure_dict = {}
    procedure_dict["name"] = procedure.name
    steps = []
    step_objs = Step.objects.filter(procedure_id = procedure_id)
    for step in step_objs:
        step_ = {}
        step_["name"] = step.name
        step_["type"] = step.type
        step_["index"] = step.index
        nodes = []
        node_objs = ScriptNode.objects.filter(step_id = step.id)
        for node in node_objs:
            node_ = {}
            node_["name"] = node.script.name
            node_["type"] = node.script.type
            node_["args"] = node.args
            node_["user"] = node.user
            node_["index"] = node.index
            node_["status"] = 0
            node_["content"] = node.script.content
            node_["servers"] = node.servers
            nodes.append(node_)
        step_["nodes"] = nodes
        steps.append(step_)
    procedure_dict["steps"] = steps

    me = request.session.get("username")
    task = do_createTask(project_id, me, procedure_dict)

    execute(task = task)

    return jsonify(test = {"code": 4}, success = True, data = task.get("id"))

def show(request, validator = ProjectForm):
    """
    显示常用流程
    """
    project_id = request.formdata.get("project_id")

    data = []
    procedures = Procedure.objects.filter(project_id = project_id).values().order_by("-last_time")
    for procedure in procedures:
        procedure["create_time"] = humanReadableDate(procedure["create_time"])
        procedure["last_time"] = humanReadableDate(procedure["last_time"])
        data.append(procedure)

    return jsonify(test = {"code": 4, "data": data}, success = True, data = data)

def delete(request, validator = ProcedureGetForm):
    """
    删除流程
    """
    project_id = request.formdata.get("project_id")
    procedure_id = request.formdata.get("procedure_id")

    try:
        procedure = Procedure.objects.get(id = procedure_id, project_id = project_id)
    except Exception:
        return jsonify(test = {"code": 2}, success = False, msg = u"流程不存在")

    do_deleteProcedure(procedure, delete_script = False)
    return jsonify(test = {"code": 4}, success = True)

def get(request, validator = ProcedureGetForm):
    """
    获取流程
    """
    project_id = request.formdata.get("project_id")
    procedure_id = request.formdata.get("procedure_id")

    try:
        procedure = Procedure.objects.get(id = procedure_id, project_id = project_id)
    except:
        return jsonify(test = {"code": 1}, success = False, msg = u"流程不存在")

    data = {}
    data["name"] = procedure.name
    steps = []
    step_objs = Step.objects.filter(procedure_id = procedure_id)
    for step in step_objs:
        step_ = {}
        step_["name"] = step.name
        step_["type"] = step.type
        nodes = []
        node_objs = ScriptNode.objects.filter(step_id = step.id)
        for node in node_objs:
            node_ = {}
            node_["name"] = node.script.name
            node_["type"] = node.script.type
            node_["args"] = node.args
            node_["user"] = node.user_id
            node_["content"] = dcompress(node.script.content)
            node_["servers"] = node.servers.split("|")
            nodes.append(node_)
        step_["nodes"] = nodes
        steps.append(step_)
    data["steps"] = steps

    return jsonify(test = {"code": 4}, success = True, data = data)

def save(request, validator = ProcedureSaveForm):
    """
    保存流程
    """
    project_id = request.formdata.get("project_id")
    procedure_id = request.formdata.get("procedure_id")
    procedure = request.formdata.get("procedure")

    try:
        procedure_dict = json.loads(procedure)
    except Exception:
        return jsonify(test = {"code": 1}, success = False, msg = u"表单数据格式错误")

    try:
        old_procedure = Procedure.objects.get(id = procedure_id, project_id = project_id)
    except:
        return jsonify(test = {"code": 2}, success = False, msg = u"流程不存在")

    # 先删除原有数据再新建流程
    create_user = do_deleteProcedure(old_procedure)

    success, msg, procedure_checked = procedureCheck(project_id, procedure_dict, check_unique = True)
    if not success:
        return jsonify(test = {"code": 3}, success = False, msg = msg)

    me = request.session.get("username")
    do_addProcedure(me, project_id, procedure_checked, id = procedure_id, create_user = create_user)

    return jsonify(test = {"code": 4}, success = True, msg = u"保存成功")

def search(request, validator = QueryForm):
    """
    流程查询
    """
    success, data, msg = query(request.formdata, Procedure)
    return jsonify(test = {"code": 4}, success = True, data = data, msg = msg)
