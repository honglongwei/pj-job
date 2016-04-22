#encoding: utf-8
from apps.api.forms import LoginForm
from libs.common import jsonify
from libs.services import getAuthService, getCmdbService

def login(request, validator = LoginForm):
    """
    用户登录
    """
    username = request.formdata.get("username")
    password = request.formdata.get("password")

    service = getAuthService()
    try:
        ret = service.auth.login(username = username, password = password)
    except Exception:
        return jsonify(test = {"code": 2}, success = False, msg = u"权限系统异常")

    result = ret.get("result", {})
    success = result.get("success")

    if not success:
        return jsonify(test = {"code": 3}, success = False, msg = u"用户名或密码错误")

    data = result.get("data", {})
    user = data.get("user", {})
    user_id = user.get("id")
    username = user.get("username")

    project = data.get("project")
    if not project:
        return jsonify(test = {"code": 4}, success = False, msg = u"请先申请业务权限")

    service = getCmdbService()
    try:
        ret = service.cmdb.getProject(project_id = project)
    except Exception:
        return jsonify(test = {"code": 5}, success = False, msg = u"资产系统异常")

    result = ret.get("result", {})
    projects = result.get("data")
    if not projects:
        return jsonify(test = {"code": 6}, success = False, msg = u"业务数据错误")

    request.session["user_id"] = user_id
    request.session["username"] = username
    request.session["project"] = projects

    return get(request)

def get(request):
    """
    获取当前登录用户数据
    """
    user_id = request.session.get("user_id")
    username = request.session.get("username")
    project = request.session.get("project")

    ret = {
        "user_id": user_id,
        "username": username,
        "project": project
    }

    return jsonify(test = {"code": 7}, success = True, data = ret)
