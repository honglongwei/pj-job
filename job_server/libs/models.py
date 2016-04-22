#encoding: utf-8
from django.db import models

class Base(models.Model):
    """
    模型基类
    """
    def __unicode__(self):
        """
        用于调试model实例 print实例时会输出所有字段值
        """
        fields = self._meta.get_fields()
        result = []

        for field in fields:
            try:
                column_name = field.attname
                result.append("{field}:{value}".format(
                    field = column_name,
                    value = getattr(self, column_name)
                ))
            except:
                continue

        return "|".join(result)

    class Meta:
        abstract = True