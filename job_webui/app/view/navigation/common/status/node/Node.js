Ext.define("Job.view.navigation.common.status.node.Node", {
    extend: "Ext.panel.Panel",

    requires: [
        "Job.view.navigation.common.status.node.Result",
        "Job.view.navigation.common.status.node.Step",
        "Job.view.navigation.common.status.node.NodeModel"
    ],

    viewModel: "Job.view.navigation.common.status.node.NodeModel",

    listeners: {
        beforedestroy: function(object){
            if(object.poller){
                object.poller.destroy();
            }
        }
    },

    node_id: null,  //需要上层赋值
    referenceHolder: true,
    autoScroll: true,
    layout: {
        type: "vbox",
        pack: "start",
        align: "stretch"
    },

    initComponent: function(){
        var me = this;
        var node_id = me.node_id;

        me.items = [{
            xtype: "container",
            padding: 10,
            layout: {
                type: "hbox",
                pack: "start"
            },

            items: [{
                xtype: "tbspacer",
                flex: 1
            },{
                xtype: "button",
                text: "返回",
                ui: "soft-green",
                margin: "1 1 0 0",
                handler: function(){
                    Job.scriptTemplateEnable = true;
                    Job.backPage(me);
                }
            }]
        },{
            xtype: "menuseparator",
            disabled: true
        },{
            xtype: "container",
            padding: 15,
            margin: "15 0 0 0",
            layout: {
                type: "vbox",
                pack: "start",
                align: "stretch"
            },

            items: [{
                xtype: "progressbar",
                reference: "ref_progressbar_result"
            },{
                xtype: "panel",
                frame: true,
                margin: "15 0 15 0",
                bodyPadding: "30 30 5 30",
                layout: "hbox",

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
                        bind: "<b>节点名称&nbsp;:</b>&nbsp;&nbsp; {name}"
                    },{
                        bind: "<b>节点状态&nbsp;:</b>&nbsp;&nbsp; {getStatus}"
                    }]
                },{
                    items: [{
                        bind: "<b>节点类型&nbsp;:</b>&nbsp;&nbsp; {getType}"
                    },{
                        bind: "<b>开始时间&nbsp;:</b>&nbsp;&nbsp; {start_time}"
                    }]
                },{
                    items: [{
                        bind: "<b>执行账户&nbsp;:</b>&nbsp;&nbsp; {user}"
                    },{
                        bind: "<b>结束时间&nbsp;:</b>&nbsp;&nbsp; {end_time}"
                    }]
                },{
                    items: [{
                        bind: "<b>总时间(s)&nbsp;:</b>&nbsp;&nbsp; {total_time}"
                    }]
                }]
            },{
                xtype: "menuseparator",
                disabled: true
            },{
                xtype: "tabpanel",
                frame: true,
                margin: "15 0 0 0",
                layout: "fit",

                items: [{
                    xtype: "xtype_result",
                    height: 352,
                    reference: "ref_panel_result"
                },{
                    xtype: "xtype_step",
                    height: 502,
                    node_id: node_id
                }]
            }]
        },{
            xtype: "menuseparator",
            disabled: true,
            margin: "0 0 40 0"
        }];

        me.callParent();
    },

    poll: function(){
        var me = this;
        var project_id = Job.getProjectId(false);
        var node_id = me.node_id;
        
        var worker = function(){
            Ext.Ajax.request({
                url: "/history/getNode.action",
                async: false,
                params: {
                    "project_id": project_id,
                    "node_id": node_id
                },
                callback_complete: function(result){
                    var node = result["data"];
                    me.build(node, true);
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

    build: function(node, update){
        var update = arguments[1] ? true : false;
        var me = this;

        var name = node.name;
        var status = node.status;
        var type = node.type;
        var start_time = node.start_time;
        var end_time = node.end_time;
        var user = node.user;
        var total_time = node.total_time;

        var viewmodel = me.getViewModel();
        viewmodel.setData({
            name: name,
            status: status,
            type: type,
            start_time: start_time,
            end_time: end_time,
            user: user,
            total_time: total_time
        });

        var panel_result = me.lookupReference("ref_panel_result");
        var store = panel_result.getViewModel().getStore("store_grid_server");
        var model = store.getModel();

        var servers = node.servers;
        Ext.each(servers, function(server, index){
            var record = null
            if(!update){
                record = model.create();
                record.set("id", id);
            }else{
                record = store.getAt(index);
            }

            record.set("id", server.id);
            record.set("host", server.host);
            record.set("code", server.code);
            record.set("total_time", server.total_time);

            if(!update){
                store.add(record);
            }
        });

        var progressbar = me.lookupReference("ref_progressbar_result");

        var ratio = null;
        if(status == 0 || status == 10){
            ratio = 0.5;
        }else{
            ratio = 1;
        }
        progressbar.updateProgress(ratio, "", true);

        if(status != 0 && status != 10){
            if(me.poller){
                me.poller.destroy();
            }

            if(update){
                var grid = panel_result.lookupReference("ref_grid_server");
                var selected = grid.getSelectionModel().getSelection();
                grid.fireEvent("selectionchange", grid, selected);
            }
        }
    }
});