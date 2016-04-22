#encoding: utf-8
from jsonrpc import jsonrpc_method
from libs.common import dictify
from forms import LoginForm, UserProjectForm
from apps.service.common.encrypt import encrypt
from apps.service.models import User, Project
from django.http import QueryDict

@jsonrpc_method("auth.login")
def login(*args, **kwargs):
    """
    用户登录
    """
    form = LoginForm(data = kwargs)
    if not form.validate():
        return dictify(test = {"code": 1,"username":kwargs}, success = False, msg = u"表单参数有误")

    username = form.username.data
    password = form.password.data

    try:
        user = User.objects.get(username = username)
    except:
        return dictify(test = {"code": 2}, success = False, msg = u"用户名或密码错误")

    if user.password.lower() != encrypt(password).lower():
        return dictify(test = {"code": 3}, success = False, msg = u"用户名或密码错误")

    user_id = user.id
    projects = Project.objects.filter(user_id = user_id)
    project = [x.project_id for x in projects]

    data = {
        "user": {
            "id": user.id,
            "username": username
        },
        "project": project
    }
        
    return dictify(test = {"code": 4}, success = True, data = data)

@jsonrpc_method("auth.hasPermissionProject")
def hasPermissionProject(*args, **kwargs):
    """
    业务权限检查
    """
    form = UserProjectForm(data = kwargs)
    if not form.validate():
        return dictify(test = {"code": 1}, success = False, msg = u"表单参数有误")

    user_id = form.user_id.data
    project_id = form.project_id.data

    if not Project.objects.filter(user_id= user_id, project_id = project_id).exists():
        return dictify(test = {"code": 2}, success = False)

    return dictify(test = {"code": 3}, success = True)