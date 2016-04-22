#encoding: utf-8
import hashlib

def encrypt(password):
    """
    加密函数
    """
    return hashlib.md5(password).hexdigest().upper()
