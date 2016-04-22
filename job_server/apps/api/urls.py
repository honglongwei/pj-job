from django.conf.urls import url
import views

urlpatterns = [
    url(r"^auth/login.action", views.auth.login, name = "auth.login"),
    url(r"^auth/get.action", views.auth.get, name = "auth.get"),

    url(r"^cmdb/get.action", views.cmdb.get, name = "cmdb.get")
]