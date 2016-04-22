#encoding: utf-8
from django.conf.urls import url
from jsonrpc import jsonrpc_site

#必须导入views用于jsonrpc method的注册
import views

urlpatterns = [
    url(r"^jsonrpc$", jsonrpc_site.dispatch, name = "jsonrpc_site")
]
