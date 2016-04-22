#encoding: utf-8
from jsonrpc import jsonrpc_method
from forms import ProjectForm, ServerForm
from libs.common import dictify
from libs.services import SealService
from apps.service.models import Project

@jsonrpc_method("cmdb.getServer")
def getServer(*args, **kwargs):
    """
    获取服务器信息
    """
    form = ServerForm(data = kwargs)
    if not form.validate():
        return dictify(test = {"code": 1}, success = False, msg = u"表单参数有误")

    project_id = form.project_id.data
    cache = form.cache.data

    try:
        project = Project.objects.values("name").get(id = project_id)
    except:
        return dictify(test = {"code": 2}, success = False, msg = u"业务不存在")

    service = SealService()
    try:
        servers = service.getServer(productName = project.get("name").encode("utf-8"), cache = cache)
    except:
        return dictify(test = {"code": 3}, success = False, msg = u"海豹系统异常")

    data = []
    for i in servers:
        if i.get("wanIpTd"):
            host = i.get("wanIpTd").split(";")[0]
        elif i.get("cloudWanIp"):
            host = i.get("cloudWanIp").split(";")[0]
        elif i.get("lanIpTd"):
            host = i.get("lanIpTd").split(";")[0]
        elif i.get("cloudLanIp"):
            host = i.get("cloudLanIp").split(";")[0]
        else:
            continue

        if i.has_key("comment"):
            desc = i.get("comment", "")
        else:
            desc = i.get("yewuComment", "")

        server = {
            "host": host,
            "zone": i.get("zoneName", ""),
            "channel": i.get("channel", ""),
            "desc": desc,
            "function": i.get("function", "")
        }  

        data.append(server)

    return dictify(test = {"code": 4}, success = True, data = data)

@jsonrpc_method("cmdb.getProject")
def getProject(*args, **kwargs):
    """
    获取业务列表
    """
    form = ProjectForm(data = kwargs)
    if not form.validate():
        return dictify(test = {"code": 1}, success = False, msg = u"表单参数有误")

    project_id = form.project_id.data

    projects = Project.objects.filter(id__in = project_id).values("id", "name")
    data = list(projects)

    return dictify(test = {"code": 4}, success = True, data = data)
