# encoding: utf-8

from wtforms import IntegerField

class IntegerExtField(IntegerField):
    """
    默认的IntegerField没有process_data处理函数
    """
    def process_data(self, value):
        try:
            self.data = int(value)
        except ValueError:
            self.data = None
            raise ValueError(self.gettext("Not a valid integer value"))
