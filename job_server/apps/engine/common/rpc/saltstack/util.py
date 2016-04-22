#encoding: utf-8
from libs.common import dcompress, isCharset
from api import client
import sys

def script(id, hosts, content, type, user, args):
    """
    脚本执行逻辑
    """
    lost, back = client(hosts, fun = "job.script", 
        args = {
            "id": id,
            "type": type,
            "content": content,
            "user": user,
            "args": args
        })

    result = {}

    for host in back:
        data = back.get(host)
        if isinstance(data, dict):
            try:
                retcode = int(data["retcode"])
                stdout = str(data["stdout"])
                stderr = str(data["stderr"])
                total_time = int(data["total_time"])

            except Exception:
                result[host] = {
                    "code": 250,
                    "log": u"协议错误",
                    "time": 0
                }
                continue

            stdout = dcompress(stdout)
            stderr = dcompress(stderr)

            if not isCharset(stdout) or not isCharset(stderr):
                result[host] = {
                    "code": 250,
                    "log": u"字符编码错误",
                    "time": 0
                }
                continue

            if sys.getsizeof(stdout)/1024 > 100:
                stdout = stdout[0:100000]
        
            if sys.getsizeof(stderr)/1024 > 100:
                stderr = stderr[0:100000]

            result[host] = {
                "code": retcode,
                "log": stdout if stdout else stderr,
                "time": total_time
            }

        else:
            result[host] = {
                "code": 250,
                "log": str(data),
                "time": 0
            }

    for host in lost:
        result[host] = {
            "code": 250,
            "log": u"客户端未返回",
            "time": 0
        }
    
    return result