#encoding: utf-8
from django.conf import settings
from django.core.exceptions import FieldError
from django.http import HttpResponse
from libs import unittests
import simplejson as json
import zlib

def jsonify(*args, **kwargs):
    """
    通用返回json
    """
    if kwargs.has_key("test"):
        del kwargs["test"]

    return HttpResponse(
        json.dumps(dict(*args, **kwargs), ensure_ascii = False),
        content_type = "application/json;charset = utf-8"
    )

def compress(str):
    """
    字符串压缩
    """
    str = str.strip()

    if str:
        if isinstance(str, unicode):
            return zlib.compress(str.encode("utf-8"), 9)
    
        return zlib.compress(str, 9)

    return ""

def dcompress(zstr):
    """
    字符串解压缩
    """
    if zstr:
        try:
            return zlib.decompress(zstr).strip()
        except Exception:
            return ""

    return ""

def isCharset(str, charset = "utf-8"):
    """
    判断字符编码
    """
    return True

def humanReadableDate(datetime):
    """
    通用日期格式化
    """
    if not datetime:
        return ""
        
    format = "%Y-%m-%d %H:%M:%S"
    return datetime.strftime(format)

def query(params, model):
    """
    通用条件查询
    """
    msg = ""
    data = []
    success = True

    project_id = params.get("project_id")
    name = params.get("name")
    create_user = params.get("create_user")
    last_user = params.get("last_user")
    create_time_start = params.get("create_time_start")
    create_time_end = params.get("create_time_end")
    last_time_start = params.get("last_time_start")
    last_time_end = params.get("last_time_end")

    create_time_between = []
    last_time_between = []

    if create_time_start:
        if create_time_end:
            if create_time_start >= create_time_end:
                success = False
                msg = u"时间条件不正确"
                return success, data, msg

            else:
                create_time_between = [create_time_start, create_time_end]

        else:
            create_time_between = [create_time_start, False]

    else:
        if create_time_end:
            create_time_between = [False, create_time_end]

    if last_time_start:
        if last_time_end:
            if last_time_start >= last_time_end:
                success = False
                msg = u"时间条件不正确"
                return success, data, msg

            else:
                last_time_between = [last_time_start, last_time_end]

        else:
            last_time_between = [last_time_start, False]

    else:
        if last_time_end:
            last_time_between = [False, last_time_end]

    time_kwargs = {}
    if create_time_between:
        if create_time_between[0]:
            time_kwargs["create_time__gte"] = create_time_between[0]

        if create_time_between[1]:
            time_kwargs["create_time__lte"] = create_time_between[1]

    if last_time_between:
        if last_time_between[0]:
            time_kwargs["last_time__gte"] = last_time_between[0]

        if last_time_between[1]:
            time_kwargs["last_time__lte"] = last_time_between[1]

    if create_user:
        time_kwargs["create_user"] = create_user

    if last_user:
        time_kwargs["last_user"] = last_user

    objects = None
    try:
        if name:
            objects = model.objects.filter(name = name, project_id = project_id).values() 

        else:
            if time_kwargs:
                objects = model.objects.filter(project_id = project_id, **time_kwargs).values()

            else:
                success = False
                msg = u"查询条件不正确"
                return success, data, msg

    except FieldError:
        success = False
        msg = u"非法字段查询"
        return success, data, msg

    if not objects or not objects.count():
        success = True
        msg = u"未找到结果"
        return success, data, msg

    for obj in objects:
        if obj.has_key("create_time") and obj["create_time"]:
            obj["create_time"] = humanReadableDate(obj["create_time"])

        if obj.has_key("last_time") and obj["last_time"]:
            obj["last_time"] = humanReadableDate(obj["last_time"])

        if obj.has_key("end_time") and obj["end_time"]:
            obj["end_time"] = humanReadableDate(obj["end_time"])

        if obj.has_key("start_time") and obj["start_time"]:
            obj["start_time"] = humanReadableDate(obj["start_time"])

        data.append(obj)

    return success, data, msg

jsonify = unittests.Ujsonify if settings.UNITTEST else jsonify