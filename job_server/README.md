##  关于运行环境
-  django: 1.9.1
-  wtform
-  memcache(用于存储session): python-memcached

##  关于团队合作开发
-  所有开发人员只能够编写view和单元测试中的代码,如有特殊情况请和负责人协商

## 关于返回值规范
- 由于前端关心的响应信息为`布尔值`,当返回假时,为了用户体验需要显示相应的提示信息
- 以下为无业务数据响应规范,或者为有业务数据响应但逻辑异常
```
jsonify(success = True)
jsonify(success = False, msg = u"错误信息")
```
- 以下为有业务数据响应规范
```
jsonify(success = True, data = None)
```
- 由于在单元测试的时候,`success`一个字段无法判断具体用例,则可以扩展为以下
- code参数必须放在第一位
```
jsonify(code = int, ...)
code: view中唯一整型,提供单元测试使用,前端不关心,即code只在单元测试中有意义
```

##  关于代码规范
- `4`tab缩进
- 统一使用`双引号`,如果双引号中还有双引号的话使用
- import的时候禁止相对引入
```
""""太可怕了" """
```
- 所有的字符串格式化
```
使用: "{me} love {you}".format(me = "张三", you = "李四")
不使用: "%s love %s" % ("张三", "李四")
```
- view里面除了view函数外禁止写其他的函数,如果有需要,写在各app的`common`中
- view返回json统一使用`libs.common.jsonify`函数
- 所有的用户输入验证必须使用wtforms,禁止写大量的if和else,验证类要写在各app的`forms.py`中
- 各app的model必须继承自`libs.models.Base`
- 单元测试必须写,且不能只有一个正常的测试用例
- 单元测试类必须继承自`libs.test.BaseTestCase`
- 单元测试中的url必须使用`reverse`方式引用

##  关于代码管理
-  统一使用公司的gitlab
-  默认为`dev`分支

##  关于代码提交
-  各开发人员在提交代码前必须跑通所有的单元测试
-  每做一次小修改都要跑回归测试
-  具体怎么做单元测试看最后

##  关于目录结构
```
├── README           #说明文件
├── apps		#app目录
│   ├── __init__.py
│   ├── api    #接口app
│   │   ├── common
│   │   │   └── __init__.py
│   │   ├── forms.py
│   │   ├── __init__.py
│   │   ├── migrations
│   │   │   └── __init__.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views
│   │       ├── auth.py
│   │       ├── cmdb.py
│   │       └── __init__.py
│   ├── engine       #任务引擎
│   │   ├── common
│   │   │   ├── __init__.py
│   │   │   └── rpc        #适配层
│   │   │       ├── __init__.py    #适配接口
│   │   │       └── saltstack      #saltstack实现层
│   │   │           ├── api.py
│   │   │           ├── __init__.py
│   │   │           ├── module.py
│   │   │           ├── test.py
│   │   │           └── util.py
│   │   ├── __init__.py
│   │   ├── tasks.py      #celery接口
│   │   └── tests.py      #单元测试
│   ├── history   #历史记录app
│   │   ├── common
│   │   │   └── __init__.py
│   │   ├── forms.py
│   │   ├── __init__.py
│   │   ├── migrations
│   │   │   └── __init__.py
│   │   ├── models.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py      #历史功能相关view
│   ├── manage 				#系统管理app
│   │   ├── __init__.py
│   │   ├── forms.py        #表单验证
│   │   ├── common
│   │   │   └── __init__.py
│   │   ├── migrations
│   │   │   └── __init__.py
│   │   ├── models.py
│   │   ├── tests.py
│   │   ├── urls.py 		＃urls配置文件
│   │   └── views
│   │       ├── __init__.py
│   │       ├── script.py 	 #脚本管理view
│   │       └── user.py 	 #用户管理view
│   └── task  			 #任务执行app
│       ├── __init__.py
│       ├── forms.py
│       ├── common
│       │   └── __init__.py
│       ├── migrations
│       │   └── __init__.py
│       ├── models.py
│       ├── tests.py
│       ├── urls.py
│       └── views
│           ├── __init__.py
│           ├── procedure.py   	#流程相关功能view
│           └── quick.py  	#快速执行相关功能view
├── db.sqlite3  		#测试数据库
├── job_server			#项目配置目录
│   ├── __init__.py
│   ├── settings.py
│   ├── settings_test.py 	#专用于单元测试的配置文件
│   ├── urls.py
│   └── wsgi.py
├── libs 				#通用功能库
│   ├── __init__.py
│   ├── common.py      #通用功能
│   ├── forms.py       #通用表单验证
│   ├── middlewares.py    #通用中间件
│   ├── models.py       #通用model
│   ├── permissions.py    #通用的权限验证
│   └── test.py         #通用的单元测试
├── log             #系统日志
│   ├── access.log     #请求+响应日志
│   └── error.log      #系统异常日志
└── manage.py
```

##  关于单元测试
-  自动跑所有的单元测试
```
python manage.py test --settings=job_server.settings_test
	--settings: 用于替代默认的settings配置文件
```

-  跑指定的单元测试
```
python manage.py test apps.task.tests.QuickTest.test_script --settings=job_server.settings_test
```
