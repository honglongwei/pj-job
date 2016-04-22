#encoding: utf-8
from libs.models import Base, models

class HistoryTask(Base):
    """
    任务历史
    """
    name = models.CharField(max_length = 200)
    user = models.CharField(max_length = 40)
    status = models.PositiveSmallIntegerField(default = 0) #0等待执行 1成功 2失败 10正在执行
    type = models.PositiveSmallIntegerField(default = 0) #1页面启动
    start_time = models.DateTimeField(auto_now_add = True)
    end_time = models.DateTimeField(null = True)
    total_time = models.PositiveIntegerField(default = 0)
    project_id = models.PositiveIntegerField()

    class Meta:
        db_table = "history_task"

class HistoryStep(Base):
    """
    步骤历史
    """
    name = models.CharField(max_length = 200)
    index = models.PositiveIntegerField()
    type = models.PositiveSmallIntegerField()
    task = models.ForeignKey(HistoryTask)

    class Meta:
        db_table = "history_step"
        ordering = ["index"]

class HistoryScriptNode(Base):
    """
    节点历史
    """
    order = models.CharField(max_length = 40)
    name = models.CharField(max_length = 200)
    content = models.BinaryField()
    type = models.PositiveSmallIntegerField()
    args = models.CharField(max_length = 200, default = "")
    user = models.CharField(max_length = 40)
    index = models.PositiveIntegerField()
    status = models.PositiveSmallIntegerField(default = 0) #0等待执行 1成功 2失败 3忽略错误 10正在执行
    start_time = models.DateTimeField(null = True)
    end_time = models.DateTimeField(null = True)
    total_time = models.PositiveIntegerField(default = 0)
    step = models.ForeignKey(HistoryStep)

    class Meta:
        db_table = "history_script_node"
        ordering = ["index"]

class HistoryScriptServer(Base):
    """
    服务器历史
    """
    host = models.CharField(max_length = 40)
    log = models.BinaryField()
    code = models.IntegerField(null = True)
    total_time = models.PositiveIntegerField(default = 0)
    node = models.ForeignKey(HistoryScriptNode)

    class Meta:
        db_table = "history_script_server"
