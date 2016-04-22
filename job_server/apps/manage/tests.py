#encoding: utf-8
from django.core.urlresolvers import reverse
from libs.test import BaseTestCase

class UserTest(BaseTestCase):
    def test_add(self):
        url = reverse("manage:user.add")
        #正常用例
        response = self.client.post(url, {
                "project_id": 20,
                "name": "zhangsan"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), True)

        #project_id错误用例
        response = self.client.post(url,{
                "project_id": "test20",
                "name": "zhangsan1"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        #username错误用例：长度小于3
        response = self.client.post(url,{
                "project_id": 20,
                "name": "zh"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        #username错误用例：用户名已存在
        response = self.client.post(url,{
                "project_id": 20,
                "name": "zhangsan"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

    def test_show(self):
        # 增加用户以便测试
        url = reverse("manage:user.add")
        response = self.client.post(url, {
            "project_id": 6,
            "name": "root"
        })
        response = self.client.post(url, {
            "project_id": 6,
            "name": "op_123"
        })

        url = reverse("manage:user.show")
        #正常用例
        response = self.client.post(url, {
                "project_id": 6
            })
        # print response.content
        self.assertEqual(response.json().get("success"), True)

    def test_delete(self):
        # 增加用户以便测试
        url = reverse("manage:user.add")
        response = self.client.post(url, {
            "project_id": 6,
            "name": "root"
        })
        response = self.client.post(url, {
            "project_id": 6,
            "name": "op_123"
        })

        url = reverse("manage:user.delete")
        #正常用例
        response = self.client.post(url, {
                "project_id": 6,
                "users_id": "[1]"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), True)

        #错误用例：user_id不存在
        response = self.client.post(url, {
                "project_id": 6,
                "users_id": "[12]"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        #错误用例：用户不属于当前业务
        response = self.client.post(url, {
                "project_id": 8,
                "users_id": "[1]"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        response = self.client.post(url, {
                "project_id": 6,
                "users_id": "[1,3,[1,2]]"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        #错误用例：用户被流程节点引用，待补充
        # response = self.client.post(url, {
        #         "project_id": 8,
        #         "user_id": 1
        #     })
        # # print response.content
        # self.assertEqual(response.json().get("success"), False)

    def test_search(self):
        #添加
        url = reverse("manage:user.add")
        response = self.client.post(url, {
                "project_id": 20,
                "name": "zhangsan"
            })

        url = reverse("manage:user.search")
        response = self.client.post(url, {
                "project_id": 20,
                "name": "",
                # "create_user": "konglw",
                "last_user": "konglw",
                "create_time_start": "2016-02-19 10:37:21",
                "create_time_end": "2016-02-19 17:37:25",
                # "last_time_start": "2016-02-19 10:37:21",
                # "last_time_end": "2016-02-19 10:37:24"
            })

        # print response.content



class ScriptTest(BaseTestCase):
    def test_add(self):
        url = reverse("manage:script.add")
        #正常用例
        response = self.client.post(url, {
            "project_id": 6,
            "name": "StopPro.sh",
            "type": 1,
            "content": "abcd"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), True)

        #错误用例：脚本名不唯一
        response = self.client.post(url, {
            "project_id": 6,
            "name": "StopPro.sh",
            "type": 5,
            "content": "abcd"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        #错误用例：type错误，超出范围
        response = self.client.post(url, {
            "project_id": 6,
            "name": "StopPro.sh",
            "type": 5,
            "content": "abcd"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        #错误用例：type错误，字符
        response = self.client.post(url, {
            "project_id": 6,
            "name": "StopPro.sh",
            "type": "w",
            "content": "abcd"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        #错误用例：脚本内容为空
        response = self.client.post(url, {
            "project_id": 6,
            "name": "StopPro.sh",
            "type": 1,
            "content": ""
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)


    def test_show(self):
        #增加脚本测试
        url = reverse("manage:script.add")
        self.client.post(url, {
            "project_id": 6,
            "name": "StopPro.sh",
            "type": 1,
            "content": "abcd"
            })
        self.client.post(url, {
            "project_id": 6,
            "name": "StartPro.sh",
            "type": 1,
            "content": "abcd"
            })

        #正确用例
        url = reverse("manage:script.show")
        response = self.client.post(url, {
            "project_id": 6
            })
        # print response.content
        self.assertEqual(response.json().get("success"), True)


    def test_delete(self):
        #增加脚本测试
        url = reverse("manage:script.add")
        self.client.post(url, {
            "project_id": 6,
            "name": "StopPro.sh",
            "type": 1,
            "content": "abcd"
            })
        self.client.post(url, {
            "project_id": 6,
            "name": "StartPro.sh",
            "type": 1,
            "content": "abcd"
            })
        #正确用例
        url = reverse("manage:script.delete")
        response = self.client.post(url, {
            "project_id": 6,
            "scripts_id": "[1]"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), True)

        #错误用例：script_id错误
        response = self.client.post(url, {
            "project_id": 6,
            "scripts_id": "[4]"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        response = self.client.post(url, {
            "project_id": 6,
            "scripts_id": "[4, 3, 5, 6]"
            })
        # print response.content
        self.assertEqual(response.json().get("success"), False)

        #错误用例：被流程节点引用，待补充

    def test_save(self):
        # 新建脚本测试
        url = reverse("manage:script.add")
        self.client.post(url, {
            "project_id": 6,
            "name": "StopPro.sh",
            "type": 1,
            "content": "abcd"
            })
        self.client.post(url, {
            "project_id": 6,
            "name": "StartPro.sh",
            "type": 1,
            "content": "abcd"
            })

        url = reverse("manage:script.save")
        # 正确用例：保存脚本，不重命名
        response = self.client.post(url, {
            "script_id": 1,
            "project_id": 6,
            "name": "StopPro.shff",
            "type": 2,
            "content": "def abcd:#print 1"
        })
        success = response.json().get("success")
        # print response.content
        self.assertEqual(success, True)

        # 正确用例：保存脚本，重命名
        response = self.client.post(url, {
            "script_id": 1,
            "project_id": 6,
            "name": "Update_bak.sh",
            "type": 2,
            "content": "bak_bak_bak"
        })
        success = response.json().get("success")
        self.assertEqual(success, True)

        # 错误用例：脚本名不唯一
        url = reverse("manage:script.save")
        response = self.client.post(url, {
            "script_id": 1,
            "project_id": 6,
            "name": "StartPro.sh",
            "type": 2,
            "content": "abcd"
        })
        success = response.json().get("success")
        # print response.json().get("code")
        self.assertEqual(success, False)

        # 错误用例：脚本类型不正确0-2
        url = reverse("manage:script.save")
        response = self.client.post(url, {
            "script_id": 1,
            "project_id": 6,
            "name": "Update.sh",
            "type": 4,
            "content": "abcdreewew"
        })
        success = response.json().get("success")
        # print response.json().get("code")
        self.assertEqual(success, False)

        # 错误用例：脚本内容为空
        url = reverse("manage:script.save")
        response = self.client.post(url, {
            "script_id": 1,
            "project_id": 6,
            "name": "Updata.sh",
            "type": 2,
            "content": ""
        })
        success = response.json().get("success")
        # print response.json().get("code")
        self.assertEqual(success, False)

    def test_get(self):
        # 新建脚本测试
        url = reverse("manage:script.add")
        response = self.client.post(url, {
            "project_id": 6,
            "name": "Update.sh",
            "type": 2,
            "content": "abcd"
        })
        url = reverse("manage:script.add")
        response = self.client.post(url, {
            "project_id": 6,
            "name": "Stop_bak.sh",
            "type": 2,
            "content": "abcdefg"
        })

        url = reverse("manage:script.get")
        # 正确用例
        response = self.client.post(url, {
            "script_id": 2,
            "project_id": 6,
        })
        success = response.json().get("success")
        # print response.content
        self.assertEqual(success, True)

        # 错误用例：脚本不存在
        response = self.client.post(url, {
            "script_id": 3,
            "project_id": 6,
        })
        success = response.json().get("success")
        # print response.content
        self.assertEqual(success, False)

    def test_search(self):
        url = reverse("manage:script.search")
        response = self.client.post(url, {
                "project_id": 1,
                "name": "",
                "create_user": "",
                "last_user": "",
                "create_time_start": "",
                "create_time_end": "2016-02-19 10:37:24",
                "last_time_start": "2016-02-19 10:37:24",
                "last_time_end": "2016-02-19 10:37:24"
            })

    def test_template(self):
        url = reverse("manage:script.template")
        response = self.client.post(url, {
            "project_id": 3,
            "type": 2,
        })
        # print response.content
        self.assertEqual(response.json().get("success"), True)