#encoding: utf-8
from libs.models import Base, models
from apps.manage.models import Script, User

class Procedure(Base):
    """
    流程
    """
    name = models.CharField(max_length = 200)
    create_user = models.CharField(max_length = 40)
    create_time = models.DateTimeField(auto_now_add = True)
    last_user = models.CharField(max_length = 40)
    last_time = models.DateTimeField(auto_now = True)
    project_id = models.PositiveIntegerField()

    class Meta:
        db_table = "procedure"

class Step(Base):
    """
    步骤
    """
    name = models.CharField(max_length = 200)
    index = models.PositiveIntegerField()
    type = models.PositiveSmallIntegerField()
    procedure = models.ForeignKey(Procedure)

    class Meta:
        db_table = "step"
        ordering = ["index"]

class ScriptNode(Base):
    """
    节点
    """
    script = models.ForeignKey(Script)
    user = models.ForeignKey(User)
    args = models.CharField(default = "", max_length = 200)
    index = models.PositiveIntegerField()
    servers = models.TextField()
    step = models.ForeignKey(Step)

    class Meta:
        db_table = "script_node"
        ordering = ["index"]