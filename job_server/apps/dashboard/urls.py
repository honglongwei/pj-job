from django.conf.urls import url
import views

urlpatterns = [
    url(r"^get.action", views.get, name="dashboard.get")
]