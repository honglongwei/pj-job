Ext.define("Job.Application", {
    extend: "Ext.app.Application",

    requires: [
        "Job.view.Viewport",
        "Job.view.common.login.Login",
        "Job.view.common.notification.Notification"
    ],
    
    name: "Job",

    stores: [
        "Navigation",
        "User",
        "Task",
        "Script"
    ],

    controllers: [
    ],

    launch: function(){
        Job.ask = function(options){
            var msg = (typeof(options.msg) != "undefined") ? options.msg : "";
            var yes_handler = (typeof(options.yes_handler) != "undefined") ? options.yes_handler : Ext.emptyFn();
            var no_handler = (typeof(options.no_handler) != "undefined") ? options.no_handler : Ext.emptyFn();

            var win = Ext.create("Ext.window.MessageBox", {
                draggable: false,
                resizable: false
            });

            win.show({
                message: msg,
                buttons: Ext.Msg.YESNO,
                buttonText: {
                    yes: "确认",
                    no: "取消"
                },
    
                fn: function(btn) {
                    switch(btn){
                        case "yes":
                            Ext.callback(yes_handler);
                            break;
    
                        case "no":
                            Ext.callback(no_handler);
                            break;
    
                        default:
                            break;
                    }
                }
            });
        };

        Job.notify = function(level, message){
            if(!message){
                return;
            };

            var task = new Ext.util.DelayedTask(function(){
                Ext.create("Job.view.common.notification.Notification", {
                    html: message
                }).show();
            });

            task.delay(200);
        };

        Job.showLogin = function(){
            Ext.create("Job.view.common.login.Login");
        };

        Job.showViewport = function(){
            Ext.create("Job.view.Viewport");
        };

        //设置ajax默认行为
        Ext.Ajax.setMethod("POST");
        Ext.Ajax.setListeners({
            beforerequest: function(conn, options, eOpts){
                if(typeof(options.operation) == "undefined"){
                    var lock = (typeof(options.lock) == "undefined") ? true : options.lock;
                }else{
                    var lock = (typeof(options.operation.lock) == "undefined") ? true : options.operation.lock;
                }
                if(lock == true && Job.lock){
                    Job.lock();
                }
            },

            requestcomplete: function(conn, response, options, eOpts){
                var callback_complete = null;
                var callback_exception = null;
                if(typeof(options.operation) == "undefined"){
                    callback_complete = (typeof(options.callback_complete) == "undefined") ? Ext.emptyFn : options.callback_complete;
                    callback_exception = (typeof(options.callback_exception) == "undefined") ? Ext.emptyFn : options.callback_exception;
                }else{
                    callback_complete = (typeof(options.operation.callback_complete) == "undefined") ? Ext.emptyFn : options.operation.callback_complete;
                    callback_exception = (typeof(options.operation.callback_exception) == "undefined") ? Ext.emptyFn : options.operation.callback_exception;
                }

                try{   
                    var result = Ext.decode(response.responseText);
                }catch(except){
                    var msg = "返回数据格式异常";
                    Job.notify("error", msg);
                    Ext.callback(callback_exception, options.scope);
                    Ext.log({
                        level: "error",
                        msg: msg,
                        dump: response.responseText
                    });
                };

                var success = result["success"]
                var msg = result["msg"]

                switch(success){
                    case true:
                        Ext.callback(callback_complete, options.scope, [result]);
                        Job.notify("info", msg);
                        break;

                    case false:
                        Ext.callback(callback_exception, options.scope);
                        Job.notify("error", msg);
                        break;

                    default:
                        var msg = "返回数据格式不规范";
                        Ext.callback(callback_exception, options.scope);
                        Job.notify("error", msg);
                        Ext.log({
                            level: "error",
                            msg: msg,
                            dump: result
                        });
                        break;
                };

                if(Job.unlock){
                    Job.unlock();
                }
            },

            requestexception: function(conn, response, options, eOpts){
                var callback_exception = null;
                if(typeof(options.operation) == "undefined"){
                    callback_exception = (typeof(options.callback_exception) == "undefined") ? Ext.emptyFn : options.callback_exception;
                }else{
                    callback_exception = (typeof(options.operation.callback_exception) == "undefined") ? Ext.emptyFn : options.operation.callback_exception;
                }

                Job.notify("error", "后端异常");
                Ext.callback(callback_exception, options.scope);
                if(Job.unlock){
                    Job.unlock();
                }
            }
        });

        this.go();
    },

    go: function(){
        Ext.Ajax.request({
            lock: false,
            url: "api/auth/get.action",
            callback_complete: function(result){
                var data = result["data"];
                var username = data["username"];
                var project = data["project"]

                Job.data.Session.setName(username);
                Job.data.Session.setProject(project);
                Job.showViewport();
            },
            callback_exception: function(){
                Job.showLogin();
            }
        });
    }
});
