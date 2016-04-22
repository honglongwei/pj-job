Ext.define("Job.view.navigation.common.status.task.Task", {
    extend: "Ext.container.Container",

    requires: [
        "Job.view.navigation.common.status.task.TaskModel",
        "Job.view.navigation.common.status.task.TaskController"
    ],

    controller: "Job.view.navigation.common.status.task.TaskController",
    viewModel: "Job.view.navigation.common.status.task.TaskModel",

    listeners: {
        beforedestroy: function(object){
            if(object.poller){
                object.poller.destroy();
            }
        }
    },

    creater: null,
    session: {
        task_id: null
    },
    bodyPadding: 40,
    layout: "responsivecolumn",
    creater: null,
    referenceHolder: true,

    initComponent: function(){
        var me = this;
        var creater = me.creater;

        me.items = [{
            xtype: "panel",
            cls: "shadow-panel",

            items: [{
                xtype: "container",
                margin: "10 15 10 15",
                layout: {
                    type: "hbox",
                    pack: "start"
                },

                items: [{
                    xtype: "combobox",
                    editable: false,
                    reference: "ref_combobox_task",
                    displayField: "name",
                    valueField: "id",
                    queryMode: "local",
                    width: 250,
                    store: "Job.store.Task",
                    hidden: creater == "history" ? false : true,
                    listeners: {
                        select: "select_change"
                    }
                },{
                    xtype: "tbspacer",
                    flex: 1
                },{
                    xtype: "button",
                    text: "返回",
                    ui: "soft-green",
                    margin: "1 1 0 0",
                    handler: function(){
                        if(me.creater){
                            me.creater.reload();
                        }
                        Job.backPage(me);
                    }
                }]
            },{
                xtype: "panel",
                bodyPadding: 15,

                defaults: {
                    xtype: "panel",
                    margin: "0 15 10 15",
                    frame: true
                },
                items: [{
                    layout: "hbox",
                    bodyPadding: "30 30 5 30",

                    defaults: {
                        xtype: "container",
                        layout: "vbox",
                        flex: 1,
                        defaults: {
                            xtype: "label",
                            margin: "5 0 15 0"
                        }
                    },

                    items: [{
                        items: [{
                            bind: "<b>任务名称&nbsp;:</b>&nbsp;&nbsp; {name}"
                        },{
                            bind: "<b>开始时间&nbsp;:</b>&nbsp;&nbsp; {start_time}"
                        }]
                    },{
                        items: [{
                            bind: "<b>执行结果&nbsp;:</b>&nbsp;&nbsp; {getStatus}"
                        },{
                            bind: "<b>结束时间&nbsp;:</b>&nbsp;&nbsp; {end_time}"
                        }]
                    },{
                        items: [{
                            bind: "<b>启动人&nbsp;:</b>&nbsp;&nbsp; {start_user}"
                        },{
                            bind: "<b>总耗时(s)&nbsp;:</b>&nbsp;&nbsp; {total_time}"
                        }]
                    }]
                },{
                    title: "任务步骤",
                    bodyPadding: 20,
                    reference: "ref_container_list",

                    items: []
                }]
            }]
        }];

        me.callParent();
    },

    poll: function(){
        var me = this;
        var project_id = Job.getProjectId(false);
        var task_id = me.getSession().task_id;

        var worker = function(){
            Ext.Ajax.request({
                url: "/history/getTask.action",
                async: false,
                params: {
                    "project_id": project_id,
                    "task_id": task_id
                },
                callback_complete: function(result){
                    var task = result["data"];
                    me.build(task, true);
                }
            });
        };

        var task = {  
            run: worker,  
            interval: 5000 
        };

        var runner = new Ext.util.TaskRunner();
        runner.start(task);
        me.poller = runner;
    },

    build: function(task, update){
        var update = arguments[1] ? true : false;
        var me = this;

        var name = task.name;
        var status = task.status;
        var user = task.user;
        var start_time = task.start_time;
        var end_time = task.end_time;
        var total_time = task.total_time;

        var viewmodel = me.getViewModel();
        viewmodel.setData({
            name: name,
            start_time: start_time,
            status: status,
            end_time: end_time,
            start_user: user,
            total_time: total_time
        });

        var steps = task.steps;
        Ext.each(steps, function(step, index){
            var step_type = step.type;
            var name = step.name;
            var id = step.id;

            switch(step_type){
                case 1:
                    var last = index + 1 == steps.length ? true : false;

                    var scriptstep = null;
                    if(!update){
                        scriptstep = me.getController().add_step(id, me, index + 1, last);
                    }else{
                        var list = me.lookupReference("ref_container_list");
                        scriptstep = list.items.items[index];
                    }

                    var nodes = step.nodes;
                    var viewmodel = scriptstep.getViewModel();
                    viewmodel.set("name", name);
                    var store = viewmodel.getStore("store_grid_step");
                    var model = store.getModel();

                    Ext.each(nodes, function(node, index){
                        var id = node.id;
                        var name = node.name;
                        var num = node.num;
                        var start_time = node.start_time;
                        var end_time = node.end_time;
                        var total_time = node.total_time;
                        var status = node.status;

                        var record = null
                        if(!update){
                            record = model.create();
                            record.set("id", id);
                        }else{
                            record = store.getAt(index);
                        }
                        
                        record.set("name", name);
                        record.set("num", num);
                        record.set("start_time", start_time);
                        record.set("end_time", end_time);
                        record.set("total_time", total_time);
                        record.set("status", status);

                        if(!update){
                            store.add(record);
                        }
                    });
                    break;

                case 2:
                    break;

                default:
                    break;
            };
        });

        if(status != 0 && status != 10){
            if(me.poller){
                me.poller.destroy();
            }
        }
    }
});