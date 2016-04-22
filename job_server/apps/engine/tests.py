#encoding: utf-8
from django.test import TestCase
from apps.engine.common.rpc.saltstack import test
from libs.common import compress, dcompress
import uuid

class SaltTest(TestCase):
    def NOtest_script(self):
        ret = test.script(str(uuid.uuid1()), compress("echo test && sleep 10 && echo 1"), 1, "root", "asdf")
        print dcompress(ret["stdout"])
        print dcompress(ret["stderr"])
        print ret["retcode"]