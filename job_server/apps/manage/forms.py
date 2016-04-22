from libs.forms import ProjectForm, IntegerField, validators
from wtforms import StringField

class UserAddForm(ProjectForm):
    name = StringField("name", [validators.Length(min = 3, max = 20)])

class UserDelForm(ProjectForm):
    users_id = StringField("users_id", [validators.DataRequired()])

class ScriptAddForm(ProjectForm):
    name = StringField("name", [validators.Length(min = 3, max = 20)])
    type = IntegerField("type", [validators.NumberRange(min = 1, max = 3)])
    content = StringField("name", [validators.Length(min = 1)])

class ScriptGetForm(ProjectForm):
    script_id = IntegerField("script_id", [validators.DataRequired()])

class ScriptDelForm(ProjectForm):
    scripts_id = StringField("scripts_id", [validators.DataRequired()])

class ScriptTemplateForm(ProjectForm):
    type = IntegerField("type", [validators.NumberRange(min = 1, max = 3)])

class ScriptSaveForm(ScriptAddForm, ScriptGetForm):
    pass
    
