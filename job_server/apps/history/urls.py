from django.conf.urls import url
import views

urlpatterns = [
    url(r"^show.action", views.show, name = "history.show"),
    url(r"^search.action", views.search, name = "history.search"),
    url(r"^getTask.action", views.getTask, name = "history.getTask"),
    url(r"^getNode.action", views.getNode, name = "history.getNode"),
    url(r"^getStep.action", views.getStep, name = "history.getStep"),
    url(r"^getServer.action", views.getServer, name = "history.getServer"),
    url(r"^ignore.action", views.ignore, name = "history.ignore"),
    url(r"^retry.action", views.retry, name = "history.retry")
]