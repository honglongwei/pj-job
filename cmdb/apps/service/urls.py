from jsonrpc import jsonrpc_site
from django.conf.urls import url

from apps.service import views

urlpatterns = [
    url(r"^jsonrpc$", jsonrpc_site.dispatch, name = "jsonrpc_site"),
]
