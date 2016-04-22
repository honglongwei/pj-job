#encoding: utf-8
from libs.common import jsonify

def script(request):
    """
    快速脚本执行
    """
    return jsonify(success = True)

def file(request):
    """
    快速文件分发
    这个先不搞
    """
    return jsonify(success = True)