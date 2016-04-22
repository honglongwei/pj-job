#encoding: utf-8
from django.conf import settings

def dictify(*args, **kwargs):
    """
    通用返回字典数据函数
    """
    if not settings.UNITTEST:
        if kwargs.has_key("test"):
            del kwargs["test"]

    return dict(*args, **kwargs)