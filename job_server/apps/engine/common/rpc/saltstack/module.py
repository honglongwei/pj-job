#encoding: utf-8
from datetime import datetime
import subprocess
import salt.utils
import tempfile
import pickle
import time
import zlib
import sys
import os

def script(id, content, type, user, args):
    timeout = 7200
    bytes_limit = 8000
    ret = {
        "retcode": 250,
        "stderr": "",
        "stdout": "",
        "total_time": 0
    }

    def compress(ret):
        ret["stderr"] = ret["stderr"].strip()
        ret["stdout"] = ret["stdout"].strip()

        if sys.getsizeof(ret["stderr"]) > bytes_limit + 100:
            ret["stderr"] = ret["stderr"][0:bytes_limit]
        if sys.getsizeof(ret["stdout"]) > bytes_limit + 100:
            ret["stdout"] = ret["stdout"][0:bytes_limit]
        
        if ret["stderr"]:
            ret["stderr"] = zlib.compress(ret["stderr"], 9)
        if ret["stdout"]:
            ret["stdout"] = zlib.compress(ret["stdout"], 9)

        return ret

    tmp_dir = tempfile.gettempdir()
    lock_file = "{dir}{sep}{uuid}.lock".format(dir = tmp_dir, uuid = id, sep = os.sep)
    db_file = "{dir}{sep}{uuid}.db".format(dir = tmp_dir, uuid = id, sep = os.sep)
    stdout_file = "{dir}{sep}{uuid}.stdout".format(dir = tmp_dir, uuid = id, sep = os.sep)
    stderr_file = "{dir}{sep}{uuid}.stderr".format(dir = tmp_dir, uuid = id, sep = os.sep)

    stdout_f = open(stdout_file, "w")
    stderr_f = open(stderr_file, "w")

    if os.path.exists(lock_file):
        while True:
            if not os.path.exists(lock_file) and os.path.exists(db_file):
                break
            time.sleep(1)
    
    if os.path.exists(db_file):
        with open(db_file, "r") as fp:
            ret_db = pickle.load(fp)
            ret["retcode"] = ret_db["retcode"]
            ret["stderr"] = ret_db["stderr"]
            ret["stdout"] = ret_db["stdout"]
            ret["total_time"] = ret_db["total_time"]

        if ret["retcode"] == 0:
            return compress(ret)

    open(lock_file, "w").close()

    shell = "unknown"
    suffix = "unknown"
    if type == 1:
        shell = "bash"
        suffix = ".sh"

    elif type == 2:
        shell = "bat"
        suffix = ".bat"

        if salt.utils.is_windows():
            shell = ""

    elif type == 3:
        shell = "python"
        suffix = ".py"

    script_file = salt.utils.mkstemp(suffix = suffix)
    content = zlib.decompress(content)
    if salt.utils.is_windows() and shell == "bash":
        with open(script_file, "wb") as fp:
            fp.write(content)
    else:
        with open(script_file, "w") as fp:
            fp.write(content)
    os.chmod(script_file, 0755)

    cmd = "{shell} {script} {args}".format(shell = shell, script = script_file, args = args)
    if salt.utils.is_windows():
        user_cmd = cmd
    elif __grains__["os"] in ["MacOS", "Darwin"]:
        user_cmd = """sudo -i -u {user} -- "{cmd}" """.format(user = user, cmd = cmd)
    elif __grains__["os"] in ["FreeBSD"]:
        user_cmd = """su - {user} -c "{cmd}" """.format(user = user, cmd = cmd)
    elif __grains__["os_family"] in ["Solaris"]:
        user_cmd = """su - {user} -c "{cmd}" """.format(user = user, cmd = cmd)
    elif __grains__["os_family"] in ["AIX"]:
        user_cmd = """su {user} -c "{cmd}" """.format(user = user, cmd = cmd)
    else:
        user_cmd = """su - {user} -c "{cmd}" """.format(user = user, cmd = cmd)
    
    start_time = datetime.now()
    process = subprocess.Popen(user_cmd, stdout = stdout_f, stderr = stderr_f, shell = True)
    while process.poll() == None:
        if timeout < 0:
            process.kill()

        time.sleep(1)
        timeout -= 1

    end_time = datetime.now()
    stdout_f.close()
    stderr_f.close()

    ret["stdout"] = open(stdout_file,"r").read(bytes_limit)
    ret["stderr"] = open(stderr_file,"r").read(bytes_limit)
    ret["retcode"] = process.returncode
    ret["total_time"] = (end_time - start_time).seconds
    stdout_f.close()
    stderr_f.close()

    with open(db_file, "w") as fp:
        pickle.dump(ret, fp)

    try:
        os.remove(script_file)
        os.remove(stdout_file)
        os.remove(stderr_file)
        os.remove(lock_file)
    except Exception:
        pass

    return compress(ret)