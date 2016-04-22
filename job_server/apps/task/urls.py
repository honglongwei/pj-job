from django.conf.urls import url
from apps.task import views

urlpatterns = [
    url(r"^quick/script.action", views.quick.script, name = "quick.script"),

    url(r"^procedure/add.action", views.procedure.add, name = "procedure.add"),
    url(r"^procedure/run.action", views.procedure.run, name = "procedure.run"),
    url(r"^procedure/runTemp.action", views.procedure.runTemp, name = "procedure.runTemp"),
    url(r"^procedure/show.action", views.procedure.show, name = "procedure.show"),
    url(r"^procedure/delete.action", views.procedure.delete, name = "procedure.delete"),
    url(r"^procedure/save.action", views.procedure.save, name = "procedure.save"),
    url(r"^procedure/get.action", views.procedure.get, name = "procedure.get"),
    url(r"^procedure/search.action", views.procedure.search, name = "procedure.search")
]
