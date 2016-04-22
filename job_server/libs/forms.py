#encoding: utf-8
from wtforms import Form, IntegerField, StringField, DateTimeField, validators

class ProjectForm(Form):
    """
    用于所有需要验证业务id的基类
    """
    project_id = IntegerField("project_id", [validators.NumberRange(min = 1)])

class QueryForm(ProjectForm):
    """
    用于通用条件查询的表单验证类
    """
    name = StringField("name")
    create_user = StringField("create_user")
    last_user = StringField("last_user")
    create_time_start = DateTimeField("create_time_start", [validators.Optional()], format = "%Y-%m-%d %H:%M:%S")
    create_time_end = DateTimeField("create_time_end", [validators.Optional()], format = "%Y-%m-%d %H:%M:%S")
    last_time_start = DateTimeField("last_time_start", [validators.Optional()], format = "%Y-%m-%d %H:%M:%S")
    last_time_end = DateTimeField("last_time_end", [validators.Optional()], format = "%Y-%m-%d %H:%M:%S")