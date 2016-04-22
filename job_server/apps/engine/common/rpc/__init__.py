#encoding: utf-8
from django.conf import settings
from apps.engine.common.rpc.saltstack import util
from libs import unittests

script = unittests.Uscript if settings.UNITTEST else util.script