#encoding: utf-8
from django.conf import settings
from apps.engine import engine
from apps.history.models import *
from apps.engine.services import do_script
from datetime import datetime

@engine.task
def execute(task):
    """
    任务执行
    """
    task_status = 1
    breakpoint = {
        "step_id": None,
        "node_id": None,
        "step_index": None,
        "node_index": None
    }
    fail_servers = []
    success_servers = []

    task_id = task.get("id")
    task_obj = HistoryTask.objects.get(id = task_id)
    task_obj.status = 10
    task_obj.save()

    task_start_time = datetime.now()
    steps = task.get("steps")
    for step in steps:
        step_id = step.get("id")
        step_index = step.get("index")

        nodes = step.get("nodes")
        for node in nodes:
            node_index = node.get("index")
            servers = node.get("servers")
            hosts = servers.keys()
            content = node.get("content")
            type = node.get("type")
            user = node.get("user")
            args = node.get("args")

            node_start_time = datetime.now()
            node_id = node.get("id")
            node_order = node.get("order")
            node = HistoryScriptNode.objects.get(id = node_id)
            node.start_time = node_start_time
            node.status = 10
            node.save()

            ret = do_script(node_order, hosts, content, type, user, args)
            node_end_time = datetime.now()
            node_total_time = (node_end_time - node_start_time).seconds

            for host in ret:
                server_id = servers.get(host)
                server = HistoryScriptServer.objects.get(id = server_id)

                result = ret.get(host)
                code = result.get("code")
                log = result.get("log")
                server_total_time = result.get("time")

                server.code = code
                server.log = log
                server.total_time = server_total_time
                server.save()

                if code != 0:
                    task_status = 2
                    fail_servers.append({
                            "id": server_id,
                            "host": server.host
                        })
                    breakpoint["step_id"] = step_id
                    breakpoint["node_id"] = node_id
                    breakpoint["step_index"] = step_index
                    breakpoint["node_index"] = node_index

                success_servers.append({
                            "id": server_id,
                            "host": server.host
                        })

            node.end_time = node_end_time
            node.total_time = node_total_time
            node.status = task_status
            node.save()

            if task_status == 2:
                break

        if task_status == 2:
            break

    task_end_time = datetime.now()
    task_total_time = (task_end_time - task_start_time).seconds

    task_obj.end_time = task_end_time
    task_obj.total_time = task_total_time
    task_obj.status = task_status
    task_obj.save()

    return {
        "status": True if task_status == 1 else False,
        "breakpoint": breakpoint,
        "servers": {
            "success": success_servers,
            "fail": fail_servers
        }
    }

execute = execute if settings.UNITTEST else execute.delay