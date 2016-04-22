#encoding: utf-8
from wtforms import Form, BooleanField, validators, FieldList
from libs.forms import IntegerExtField

class ServerForm(Form):
    project_id = IntegerExtField("project_id", [validators.DataRequired()])
    cache = BooleanField("cache", [validators.Optional()], default = True)

class ProjectForm(Form):
    project_id = FieldList(IntegerExtField("id", [validators.DataRequired()]), min_entries = 1)