#encoding: utf-8
from libs.common import jsonify, json, query, humanReadableDate
from libs.forms import ProjectForm, QueryForm
from apps.manage.forms import UserAddForm, UserDelForm
from apps.task.models import ScriptNode
from apps.manage.models import User

def add(request, validator = UserAddForm):
    """
    添加用户
    """
    me = request.session.get("username")
    project_id = request.formdata.get("project_id")
    name = request.formdata.get("name")

    if User.objects.filter(name = name, project_id = project_id).exists():
        return jsonify(success = False, msg = u"用户已存在")

    user = User()
    user.name = name
    user.project_id = project_id
    user.create_user = me
    user.save()

    return jsonify(test = {"id": user.id}, success = True, msg = u"用户添加成功")

def show(request, validator = ProjectForm):
    """
    获取用户列表
    """
    project_id = request.formdata.get("project_id")

    users = User.objects.filter(project_id = project_id).values("id", "name", "create_user", "create_time").order_by("-create_time")
    data = []
    for user in users:
        user["create_time"] = humanReadableDate(user["create_time"])
        data.append(user)
    return jsonify(success = True, data = data)

def delete(request, validator = UserDelForm):
    """
    删除用户
    """
    project_id = request.formdata.get("project_id")
    users_id = request.formdata.get("users_id")

    try:
        users_id = list(set(json.loads(users_id)))
    except:
        return jsonify(success = False, msg = u"表单参数有误")

    for user_id in users_id:
        if not isinstance(user_id, int):
            return jsonify(success = False, msg = u"表单参数有误")

    users = User.objects.filter(id__in = users_id, project_id = project_id)
    if not users.count():
        return jsonify(success = False, msg = u"用户不存在")

    if ScriptNode.objects.filter(user__in = users).exists():
        return jsonify(success = False, msg = u"用户正在被使用")
    users.delete()

    return jsonify(success = True)

def search(request, validator = QueryForm):
    """
    查询用户
    """
    success, data, msg = query(request.formdata, User)
    return jsonify(success = success, data = data, msg = msg)