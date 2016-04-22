#encoding: utf-8
from wtforms import Form, validators, StringField
from libs.forms import IntegerExtField

class LoginForm(Form):
    username = StringField("username", [validators.DataRequired()])
    password = StringField("password", [validators.DataRequired()])

class UserProjectForm(Form):
    user_id = IntegerExtField("user_id",[validators.DataRequired()])
    project_id = IntegerExtField("project_id",[validators.DataRequired()])
