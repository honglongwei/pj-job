#encoding: utf-8
import salt.client

def client(hosts, fun, args):
    """
    saltstack封装
    """
    hosts = list(set(hosts))

    local = salt.client.LocalClient()
    ret = local.cmd(
                tgt       = hosts,
                fun       = fun,
                kwarg     = args,
                expr_form = "list"
            )

    lost = []
    back = ret

    for id in hosts:
        if not ret.has_key(id):
            lost.append(id)

    return lost, back