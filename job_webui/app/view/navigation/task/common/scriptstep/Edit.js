Ext.define("Job.view.navigation.task.common.scriptstep.Edit",{
    extend: "Ext.window.Window",

    requires: [
        "Job.view.navigation.task.common.scriptstep.EditController",
        "Job.view.navigation.task.common.scriptstep.EditModel"
    ],

    controller: "Job.view.navigation.task.common.scriptstep.EditController",
    viewModel: "Job.view.navigation.task.common.scriptstep.EditModel",

    readOnly: false,
    bodyPadding: "10 20 20 20",
    draggable: false,
    resizable: false,
    y: 50,
    frame: true,
    modal: true,
    autoScroll: true,
    referenceHolder: true,

    initComponent: function(){
        var me = this;
        var readOnly = me.readOnly;

        var viewport = Job.getViewport();
        me.maxHeight = viewport.getHeight() - 100;

        me.items = [{
            xtype: "scripteditor",
            reference: "ref_scripteditor",
            readOnly: readOnly
        },{
            xtype: "container",
            width: 800,
            margin: "10 0 0 0",
    
            layout: {
                type: "hbox",
                pack: "start",
                align: "stretch"
            },
    
            items: [{
                html: "选择机器:",
                width: 85,
                margin: "8 0 0 0"
            },{
                xtype: "button",
                text: "选择服务器",
                iconCls: "x-fa fa-server",
                disabled: readOnly,
                handler: "show_server"
            }]
        },{
            xtype: "grid",
            frame: true,
            reference: "ref_grid_server",
            emptyText: "嘛也没有",
            columnLines: true,
            margin: "8 0 0 85",
            width: 715,
            maxHeight: 300,
            viewConfig: {
                markDirty: false
            },
    
            bind: {
                store: "{store_grid_server}"
            },
    
            columns: {
                defaults: {
                    sortable:false,
                    menuDisabled:true,
                    resizable:false,
                    focusCls: "",
                    flex: 1
                },
                items: [{
                    text: "主机",
                    dataIndex: "host"
                },{
                    text: "描述",
                    dataIndex: "desc",
                    flex: 1.5
                },{
                    xtype: "widgetcolumn",
                    text: "操作",
                    align: "center",
                    dataIndex: "some_action",
                    flex: 1.5,
    
                    widget: {
                        xtype: "container",
                        layout: "center",
                        defaults: {
                            xtype: "button",
                            padding: 0,
                            height: 20,
                            width: 50
                        },
        
                        items: [{
                            text: "删除",
                            ui: "soft-purple",
                            disabled: readOnly,
                            handler: "delete"
                        }]
                    }
                }]
            }
        }];

        me.buttons = [{
            xtype: "button",
            text: "保存",
            disabled: readOnly,
            handler: "save"
        },{
            xtype: "button",
            text: "取消",
            handler: "close"
        }];

        me.callParent();
    },

    updateServer: function(records){
        var store = this.getViewModel().getStore("store_grid_server");
        if(records.length){
            store.setData(records);
        }
    },

    update: function(content, type, records){
        var editor = this.lookupReference("ref_scripteditor");
        
        editor.setType(type);
        editor.setContent(content);
        this.updateServer(records);
    }
})
