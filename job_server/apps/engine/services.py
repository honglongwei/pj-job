#encoding: utf-8
from apps.engine.common.rpc import script
from libs.common import compress
import sys

def do_script(id, hosts, content, type, user, args):
    """
    脚本执行接口
    """
    ret = script(str(id), list(hosts), str(content), int(type), str(user), str(args))

    for host in ret:
        ret[host]["log"] = compress(ret[host]["log"])

    return ret