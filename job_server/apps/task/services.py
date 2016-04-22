# encoding: utf-8
from django.db import transaction
from apps.task.models import Step, Procedure, ScriptNode
from apps.manage.models import Script
from apps.history.models import HistoryTask, HistoryStep, HistoryScriptNode, HistoryScriptServer
import uuid

def do_addProcedure(user, project_id, procedure_checked, id = None, create_user = None):
    """
    创建procedure
    """
    with transaction.atomic():
        procedure = Procedure()
        if id:
            procedure.id = id
        procedure.name = procedure_checked["name"]
        procedure.create_user = create_user if create_user else user
        procedure.last_user = user
        procedure.project_id = project_id
        procedure.save()

        scriptnodes = []
        for step in procedure_checked["steps"]:
            step_ = Step()
            step_.name = step["name"]
            step_.index = step["index"]
            step_.type = step["type"] 
            step_.procedure = procedure
            step_.save()

            for node in step["nodes"]:
                script = Script()
                script.name = node["name"]
                script.content = node["content"]
                script.type = node["type"]
                script.project_id = project_id
                script.create_user = create_user if create_user else user
                script.last_user = user
                script.save()
                
                node_ = ScriptNode()
                node_.script = script
                node_.user = node["user"]
                node_.args = node["args"]
                node_.index = node["index"]
                node_.servers = node["servers"]
                node_.step = step_
                scriptnodes.append(node_)

        ScriptNode.objects.bulk_create(scriptnodes)
    return procedure.id

def do_deleteProcedure(procedure, delete_script = True):
    """
    删除procedure
    """
    with transaction.atomic():
        steps = Step.objects.filter(procedure_id = procedure.id)
        for step in steps:
            nodes = ScriptNode.objects.filter(step_id = step.id)
            if delete_script:
                for node in nodes:
                    node.script.delete()
            nodes.delete()
        steps.delete()
        procedure.delete()

        return procedure.create_user

def do_createTask(project_id, user, procedure_checked):
    """
    创建任务，同时创建任务执行历史记录
    """
    task = {}
    with transaction.atomic():
        history_task = HistoryTask()
        history_task.name = procedure_checked["name"]
        history_task.user = user
        history_task.status = 0
        history_task.type = 1
        history_task.project_id = project_id
        history_task.save()
        task["id"] = history_task.id
        
        hsteps = []
        for step in procedure_checked["steps"]:
            step_ = HistoryStep()
            step_.name = step["name"]
            step_.index = step["index"]
            step_.type = step["type"]
            step_.task = history_task
            step_.save()

            hstep = {}
            hstep["id"] = step_.id
            hstep["type"] = step["type"]
            hstep["index"] = step["index"]

            hnodes = []
            for node in step["nodes"]:
                user = node["user"].name
                node_ = HistoryScriptNode()
                node_.order = str(uuid.uuid1())
                node_.name = node["name"]
                node_.content = node["content"]
                node_.type = node["type"]
                node_.args = node["args"]
                node_.user = user
                node_.index = node["index"]
                node_.step = step_
                node_.save()

                hnode = {}
                hnode["id"] = node_.id
                hnode["order"] = node_.order
                hnode["type"] = node["type"] 
                hnode["index"] = node["index"] 
                hnode["args"] = node["args"] 
                hnode["content"] = node_.content
                hnode["user"] = user

                hservers = {}
                for host in node["servers"].split("|"):
                    script = HistoryScriptServer()
                    script.host = host
                    script.node = node_
                    script.save()
                    hservers[host] = script.id 
                hnode["servers"] = hservers
                hnodes.append(hnode)
            hstep["nodes"] = hnodes
            hsteps.append(hstep)
        task["steps"] = hsteps
    return task
