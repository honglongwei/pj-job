from libs.forms import ProjectForm, Form, validators
from wtforms import StringField, BooleanField

class LoginForm(Form):
    username = StringField("username", [validators.DataRequired()])
    password = StringField("password", [validators.DataRequired()])

class ServerForm(ProjectForm):
    cache = BooleanField("cache", [validators.Optional()], default = True)