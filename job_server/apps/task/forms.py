from libs.forms import ProjectForm, validators, IntegerField, StringField

class ProcedureAddForm(ProjectForm):
    procedure = StringField("procedure", [validators.DataRequired()])


class ProcedureGetForm(ProjectForm):
    procedure_id = IntegerField("procedure_id", [validators.DataRequired()])


class ProcedureSaveForm(ProjectForm):
    procedure_id = IntegerField("procedure_id", [validators.DataRequired()])
    procedure = StringField("procedure", [validators.DataRequired()])
