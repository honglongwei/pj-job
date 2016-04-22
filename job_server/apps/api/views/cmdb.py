#encoding: utf-8
from libs.common import jsonify
from libs.services import getCmdbService
from apps.api.forms import ServerForm

def get(request, validator = ServerForm):
    """
    获取服务器列表
    """
    project_id = request.formdata.get("project_id")
    cache = request.formdata.get("cache")

    service = getCmdbService()
    try:
        ret = service.cmdb.getServer(project_id = project_id, cache = cache)
    except:
        return jsonify(test = {"code": 3}, success = False, msg = u"资产系统异常")

    result = ret.get("result")
    data = result.get("data")

    return jsonify(test = {"code": 4}, success = True, data = data)
