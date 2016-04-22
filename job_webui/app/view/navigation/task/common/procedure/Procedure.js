Ext.define("Job.view.navigation.task.common.procedure.Procedure", {
    extend: "Ext.container.Container",

    requires: [
        "Job.view.navigation.task.common.procedure.ProcedureController"
    ],

    controller: "Job.view.navigation.task.common.procedure.ProcedureController",

    listeners: {
        afterrender: "setup"
    },

    bodyPadding: 40,
    layout: "responsivecolumn",
    referenceHolder: true,
    readOnly: false,
    showBack: false,
    callback_when_back: null,
    callback_when_back_scope: null,

    initComponent: function(){
        var me = this;
        var readOnly = me.readOnly;
        var showBack = me.showBack;
        var callback_when_back = me.callback_when_back;
        var callback_when_back_scope = me.callback_when_back_scope;

        me.items = [{
            xtype: "panel",
            cls: "shadow-panel",
            bodyPadding: "0 0 20 20",
            buttonAlign: "center",
    
            items: [{
                xtype: "container",
    
                layout: {
                    type: "hbox",
                    pack: "start"
                },
    
                items: [{
                    xtype: "textfield",
                    labelWidth: 80,
                    fieldLabel: "流程名称",
                    reference: "ref_textfield_name",
                    name: "script",
                    readOnly: readOnly,
                    allowBlank: false,
                    maxLength: 200,
                    maxLengthText: "不能超过{0}个字符",
                    width: 500,
                    margin: "30 0 30 0"
                },{
                    xtype: "tbspacer",
                    flex: 1
                },{
                    xtype: "button",
                    text: "返回",
                    ui: "soft-green",
                    hidden: !showBack,
                    margin: "1 1 0 0",
                    handler: function(){
                        if(callback_when_back && Ext.isFunction(callback_when_back) && callback_when_back_scope){
                            Ext.callback(callback_when_back, callback_when_back_scope);
                        }
                        Job.backPage(me);
                    }
                }]
            },{
                xtype: "container",
                reference: "ref_container_list",
                margin: "0 20 0 0"
            },{
                xtype: "button",
                margin: "20 0 0 0",
                text: "添加步骤",
                iconCls: "x-fa fa-plus",
                hidden: readOnly,
    
                menu: [{
                    text:"添加脚本",
                    handler: "add_scriptstep"
                }]
            }],
    
            buttons: [{
                text: "保存",
                width: 100,
                margin: "0 20 0 0",
                hidden: readOnly,
                iconCls: "x-fa fa-floppy-o",
                handler: "save"
            },{
                text: "执行",
                width: 100,
                iconCls: "x-fa fa-hand-o-right",
                handler: "run"
            }]
        }];

        me.callParent();
    },

    addScriptstep: function(add_node){
        var me = this;
        var add_node = arguments[0] ? true : false;

        var readOnly = me.readOnly;
        var procedurelist = me.lookupReference("ref_container_list");
        var scriptstep = Ext.create("Job.view.navigation.task.common.scriptstep.Scriptstep",{
            readOnly: readOnly,
            if_close: function(){
                if(procedurelist.items.length == 1){
                    Job.notify("warning","流程中至少需要一个步骤");
                    return false;
                }

                return true;
            },

            move_up: function(){
                var childs = procedurelist.items.items;
                Ext.each(childs, function(child, index){
                    if(scriptstep == child){
                        if(index === 0){
                            return false;
                        }else{
                            var prev = childs[index - 1];
                            procedurelist.moveBefore(scriptstep, prev);
                            return false;
                        }
                    }
                })
            },
            move_down: function(){
                var childs = procedurelist.items.items;
                Ext.each(childs, function(child, index){
                    if(scriptstep == child){
                        if(index === childs.length - 1){
                            return false;
                        }else{
                            var next = childs[index + 1];
                            procedurelist.moveAfter(scriptstep, next);
                            return false;
                        }
                    }
                })
            }
        });

        if(add_node){
            scriptstep.getController().add_node();
        }
        
        procedurelist.add(scriptstep);
        return scriptstep;
    },

    build: function(procedure, is_clone){
        var me = this;
        var is_clone = arguments[1] ? true : false;

        var name = null;
        if(is_clone){
            name = procedure.name + "(请改名)";
        }else{
            name = procedure.name
        }
        
        me.lookupReference("ref_textfield_name").setValue(name);

        var steps = procedure.steps;
        Ext.each(steps, function(step){
            var step_type = step.type;
            var name = step.name;

            switch(step_type){
                case 1:
                    var scriptstep = me.addScriptstep();
                    scriptstep.on("afterrender", function(){
                        scriptstep.setName(name);
                    });

                    var nodes = step.nodes;
                    var store = scriptstep.getViewModel().getStore("store_grid_node");

                    var model = store.getModel();
                    Ext.each(nodes, function(node){
                        var name = null;
                        if(is_clone){
                            name = node.name + "(请改名)";
                        }else{
                            name = node.name
                        }
                        
                        var user = node.user;
                        var args = node.args;
                        var content = node.content;
                        var type = node.type;
                        var servers = node.servers;
                        var num = servers.length;

                        var record = model.create();
                        record.set("name", name);
                        record.set("user", user);
                        record.set("args", args);
                        record.set("content", content);
                        record.set("type", type);
                        record.set("num", num);

                        var server_store = record.getServerStore();
                        Ext.each(servers, function(server){
                            var server_record = Ext.create("Job.model.Server");
                            server_record.set("host", server);
                            server_store.add(server_record);
                        });
                        store.add(record);
                    });
                    break;

                case 2:
                    break;

                default:
                    break;
            };
        });
    }
});