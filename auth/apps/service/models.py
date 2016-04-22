#encoding: utf-8
from django.db import models

class Project(models.Model):
    user_id = models.IntegerField()
    project_id = models.IntegerField()

    class Meta:
        db_table = "project"

class User(models.Model):
    username = models.CharField(max_length = 40)
    password = models.CharField(max_length = 40)

    class Meta:
        db_table = "user"