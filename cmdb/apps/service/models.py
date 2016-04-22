#encoding: utf-8
from libs.models import Base, models

class Project(Base):
    """
    项目
    """
    name = models.CharField(max_length = 200)

    class Meta:
        db_table = "project"
