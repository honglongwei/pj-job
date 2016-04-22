#encoding: utf-8
import salt.config
import salt.loader
import module
from module import script

__opts__ = salt.config.minion_config("/etc/salt/minion")
__grains__ = salt.loader.grains(__opts__)
__opts__["grains"] = __grains__
__opts__["master_uri"] = "tcp://127.0.0.1:4506"
__salt__ = salt.loader.minion_mods(__opts__)

module.__salt__ = __salt__
module.__grains__ = __grains__