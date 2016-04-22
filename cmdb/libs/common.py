#encoding: utf-8
from django.conf import settings
import hashlib

def dictify(*args, **kwargs):
    """
    通用返回字典数据函数
    """
    if not settings.UNITTEST:
        if kwargs.has_key("test"):
            del kwargs["test"]

    return dict(*args, **kwargs)

def humanReadableDate(datetime):
    """通用日期格式化
    
    用于对datetime对象的格式化 一般只会在model的日期数据使用
    
    Arguments:
        datetime {datetime} -- datetime对象
    
    Returns:
        {str} -- 格式化后的字符串 用于前端
    """
    if not datetime:
        return ""
        
    format = "%Y-%m-%d %H:%M:%S"
    return datetime.strftime(format)

def encrypt(password):
    """
    加密函数
    """
    return hashlib.md5(password).hexdigest().upper()
