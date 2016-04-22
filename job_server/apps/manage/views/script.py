#encoding: utf-8
from django.conf import settings
from libs.common import jsonify, json, query, humanReadableDate, dcompress, compress
from libs.forms import ProjectForm
from apps.manage.forms import ScriptAddForm, ScriptDelForm, ScriptSaveForm, ScriptGetForm, ScriptTemplateForm
from apps.manage.models import Script
from apps.task.models import ScriptNode
import os, sys

def add(request, validator = ScriptAddForm):
    """
    新建脚本
    """
    me = request.session.get("username")
    name = request.formdata.get("name")
    content = request.formdata.get("content")
    type = request.formdata.get("type")
    project_id = request.formdata.get("project_id")

    if sys.getsizeof(content)/1024 > 50:
        return jsonify(success = False, msg = u"脚本不能超过50KB")

    if Script.objects.filter(name = name, project_id = project_id).exists():
        return jsonify(success = False, msg = u"脚本已存在")

    script = Script()
    script.name = name
    script.content = compress(content)
    script.type = type
    script.create_user = me
    script.last_user = me
    script.project_id = project_id
    script.save()
    return jsonify(success = True)

def show(request, validator = ProjectForm):
    """
    获取脚本列表
    """
    project_id = request.formdata.get("project_id")

    scripts = Script.objects.filter(project_id = project_id).values("id", "name", "create_user", "create_time", "last_user", "last_time").order_by("-last_time")
    data = []
    for script in scripts:
        script["create_time"] = humanReadableDate(script["create_time"])
        script["last_time"] = humanReadableDate(script["last_time"])
        data.append(script)
    return jsonify(success = True, data = data)

def delete(request, validator = ScriptDelForm):
    """
    删除脚本
    """
    project_id = request.formdata.get("project_id")
    scripts_id = request.formdata.get("scripts_id")

    try:
        scripts_id = list(set(json.loads(scripts_id)))
    except:
        return jsonify(code = 2, success = False, msg = u"表单参数有误")

    for script_id in scripts_id:
        if not isinstance(script_id, int):
            return jsonify(code = 3, success = False, msg = u"表单参数有误")

    scripts = Script.objects.filter(id__in = scripts_id, project_id = project_id)
    if not scripts.count():
        return jsonify(success = False, msg = u"脚本不存在")
        
    if ScriptNode.objects.filter(script__in = scripts).exists():
        return jsonify(success = False, msg = u"脚本正在被使用")
    scripts.delete()

    return jsonify(success = True)

def save(request, validator = ScriptSaveForm):
    """
    保存脚本
    """
    me = request.session.get("username")
    script_id = request.formdata.get("script_id")
    name = request.formdata.get("name")
    content = request.formdata.get("content")
    type = request.formdata.get("type")
    project_id = request.formdata.get("project_id")

    if sys.getsizeof(content)/1024 > 50:
        return jsonify(success = False, msg = u"脚本不能超过50KB")

    try:
        script = Script.objects.get(id = script_id, project_id = project_id)
    except:
        return jsonify(code = 1, success = False, msg = u"脚本不存在")

    #相同业务，存在id不同，但name相同的脚本，报错
    if Script.objects.filter(project_id = project_id, name = name).exists() and script.name != name:
        return jsonify(code = 2, success = False, msg = u"脚本名不能重复")
    
    script.name = name  
    script.content = compress(content)
    script.type = type
    script.last_user = me
    script.save()

    return jsonify(success = True)

def get(request, validator = ScriptGetForm):
    """
    返回脚本内容
    """
    project_id = request.formdata.get("project_id")
    script_id = request.formdata.get("script_id")

    try:
        script = Script.objects.values("name", "content", "type").get(id = script_id, project_id = project_id)
    except Exception:
        return jsonify(success = False, msg = u"脚本不存在")

    data = {
        "name": script.get("name"),
        "content": dcompress(script.get("content")),
        "type": script.get("type")
    }

    return jsonify(success = True, data = data)

def search(request):
    """
    查询脚本
    """
    return jsonify(success = True)

def template(request, validator = ScriptTemplateForm):
    """
    获取脚本模版
    """
    project_id = request.formdata.get("project_id")
    type = request.formdata.get("type")

    base_dir = settings.BASE_DIR
    template_dir = base_dir + "/apps/manage/common/template"
    script_path = None

    if(type == 1):
        script_path = template_dir + "/template.sh"
    elif(type == 2):
        script_path = template_dir + "/template.bat"
    elif(type == 3):
        script_path = template_dir + "/template.py"
    else:
        pass

    data = None
    if os.path.exists(script_path) and os.path.isfile(script_path):
        fp = open(script_path, "r")
        data = fp.read()
        fp.close()
    else:
        return jsonify(success = False, msg = u"脚本模版不存在")

    return jsonify(success = True, data = data)