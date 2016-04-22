from django.conf.urls import url
import views

urlpatterns = [
    url(r"^user/add.action", views.user.add, name="user.add"),
    url(r"^user/show.action", views.user.show, name="user.show"),
    url(r"^user/delete.action", views.user.delete, name="user.delete"),
    url(r"^user/search.action", views.user.search, name="user.search"),

    url(r"^script/add.action", views.script.add, name="script.add"),
    url(r"^script/show.action", views.script.show, name="script.show"),
    url(r"^script/delete.action", views.script.delete, name="script.delete"),
    url(r"^script/save.action", views.script.save, name="script.save"),
    url(r"^script/get.action", views.script.get, name="script.get"),
    url(r"^script/search.action", views.script.search, name="script.search"),
    url(r"^script/template.action", views.script.template, name="script.template")
]