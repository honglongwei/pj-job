Ext.define("Job.view.navigation.task.common.server.Server",{
    extend: "Ext.window.Window",

    requires: [
        "Job.view.navigation.task.common.server.cmdb.Cmdb",
        "Job.view.navigation.task.common.server.ServerController"
    ],

    controller: "Job.view.navigation.task.common.server.ServerController",

    draggable: false,
    resizable: false,
    header: false,
    frame: true,
    modal: true,
    layout: "fit",

    initComponent: function(){
        var me = this;

        var viewport = Job.getViewport();
        me.width = viewport.getWidth() - 200;
        me.height = viewport.getHeight() - 200;

        me.items = [{
            xtype: "tabpanel",
            closable: true,
            tabBarHeaderPosition: 0,
            reference: "ref_tabpanel",

            header: {
                padding: "12 16 12 0"
            },

            items: [{
                xtype: "xtype_cmdb"
            },{
                xtype: "panel",
                title: "手动添加",
                disabled: true
            }],

            close: function(){
                me.close();
            }
        }];
    
        me.buttons = [{
            xtype: "button",
            text: "添加",
            handler: "add"
        },{
            xtype: "button",
            text: "取消",
            handler: "close"
        }];

        me.callParent();
    }
});
