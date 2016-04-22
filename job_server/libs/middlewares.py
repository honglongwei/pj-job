#encoding: utf-8
from django.core.urlresolvers import reverse
from libs.common import jsonify
from libs.forms import Form
from libs.permissions import hasPermissionProject
import inspect
import logging

class PostRequiredMiddleware(object):
    """
    检查是否是POST请求
    """
    def process_request(self, request):
        if request.method != "POST":
            return jsonify(code = 2000, success = False)
        return

class FormMiddleware(object):
    """
    表单验证
    """
    def process_view(self, request, view_func, view_args, view_kwargs):
        args_obj = inspect.getargspec(view_func)
        args_names = args_obj.args
        request.formdata = {}

        if "validator" not in args_names:
            return

        default_values = args_obj.defaults
        default_args = args_names[len(default_values) - len(args_names):]

        try:
            form_class = default_values[default_args.index("validator")]
        except Exception:
            raise Exception("validator must has a default value")

        form = form_class(request.POST)
        if not form.validate():
            return jsonify(test = {"code": 500}, success = False, msg = u"表单参数有误")

        request.formdata = form.data
        return

class ProjectMiddleware(object):
    """
    业务权限验证
    """
    def __init__(self):
        """
        在白名单之内的不受检查
        """
        self.white_list = [
            reverse("api:auth.login"),
            reverse("api:auth.get")
        ]

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.path in self.white_list:
            return

        project_id = request.formdata.get("project_id")
        user_id = request.session.get("user_id")

        if not hasPermissionProject(user_id, project_id):
            return jsonify(test = {"code": 600}, success = False, msg = u"当前用户没有业务权限")
        return

class LoginRequiredMiddleware(object):
    """
    检查是否登陆
    """
    def __init__(self):
        """
        在白名单之内的不受检查
        """
        self.white_list = [
            reverse("api:auth.login")
        ]

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.path in self.white_list:
            return

        if not request.session.get("username"):
            return jsonify(code = 1000, success = False)
        return

class LogMiddleware(object):
    """
    日志记录:
        请求响应日志
        异常日志
    """
    access_logger = logging.getLogger('access')
    error_logger = logging.getLogger('error')

    def process_response(self, request, response):
        self.access_logger.debug("|".join([
            request.method,
            request.path,
            str(dict(request.POST)),
            str(response.status_code),
            response.content.decode(encoding = 'utf-8')
        ]))
        return response

    def process_exception(self, request, exception):
        self.error_logger.debug("|".join([
            request.method,
            request.path,
            str(dict(request.POST)),
            exception.message
        ]))