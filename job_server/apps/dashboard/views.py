#encoding: utf-8
from libs.common import jsonify, humanReadableDate
from libs.forms import ProjectForm
from apps.task.models import Procedure
from apps.history.models import HistoryTask
import datetime

def get(request, validator = ProjectForm):
    """
    获取业务数据
    """
    project_id = request.formdata.get("project_id")

    servers = 250
    procedures = Procedure.objects.filter(project_id = project_id).count()

    gte_time = datetime.date.today() - datetime.timedelta(days = 7)
    tasks = HistoryTask.objects.filter(project_id = project_id, start_time__gte = gte_time).order_by("-start_time").values()

    total = len(tasks)
    success = 0
    fail = 0
    runing = 0

    tasks = tasks[0:10]

    for task in tasks:
        task["start_time"] = humanReadableDate(task["start_time"])
        task["end_time"] = humanReadableDate(task["end_time"])

        status = task.get("status")
        if status == 0:
            runing += 1

        elif status == 1:
            success += 1

        elif status == 2:
            fail += 1

        else:
            pass
    
    status = {
        "total": total,
        "success": success,
        "fail": fail,
        "runing": runing
    }

    data = {
        "tasks": list(tasks),
        "info": {
            "procedures": procedures,
            "servers": servers,
            "status": status
        }
    }

    return jsonify(test = {"code": 3}, success = True, data = data)