#encoding: utf-8
from libs.models import Base, models

class User(Base):
	"""
	执行用户
	"""
	name = models.CharField(max_length = 40)
	create_user = models.CharField(max_length = 40)
	create_time = models.DateTimeField(auto_now_add = True)
	project_id = models.IntegerField()

	class Meta:
		db_table = "user"

class Script(Base):
	"""
	脚本
	"""
	name = models.CharField(max_length = 200)
	content = models.BinaryField()
	type = models.IntegerField()
	create_user = models.CharField(max_length = 40)
	create_time = models.DateTimeField(auto_now_add = True)
	last_user = models.CharField(max_length = 40)
	last_time = models.DateTimeField(auto_now = True)
	project_id = models.IntegerField()

	class Meta:
		db_table = "script"