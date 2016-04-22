#encoding: utf-8
from libs.services import getAuthService, getCmdbService

def hasPermissionProject(user_id, project_id):
    """
    业务权限检查
    """
    service = getAuthService()

    try:
        ret = service.auth.hasPermissionProject(project_id = project_id, user_id = user_id)
    except Exception:
        return False 

    result = ret.get("result", {})
    return result.get("success")

def isServersInProject(servers, project_id):
    """
    服务器权限检查
    """
    return True
    # service = getCmdbService()

    # try:
    #     ret = service.cmdb.isServersInProject(project_id = project_id, servers = servers)
    # except Exception:
    #     return False 

    # result = ret.get("result", {})
    # return result.get("success")