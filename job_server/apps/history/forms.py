from libs.forms import ProjectForm, validators, IntegerField

class HistoryGetForm(ProjectForm):
    start = IntegerField("start", [validators.NumberRange(min = 0)])
    limit = IntegerField("limit", [validators.DataRequired()])

class HistoryTaskForm(ProjectForm):
    task_id = IntegerField("task_id", [validators.DataRequired()])

class HistoryNodeForm(ProjectForm):
    node_id = IntegerField("node_id", [validators.DataRequired()])

class HistoryServerForm(ProjectForm):
    server_id = IntegerField("server_id", [validators.DataRequired()])

class HandleForm(HistoryTaskForm, HistoryNodeForm):
    step_id = IntegerField("step_id", [validators.DataRequired()])