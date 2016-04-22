Ext.define("Job.view.navigation.task.manage.Manage", {
    extend: "Job.view.navigation.common.manage.Manage",

    requires: [
        "Job.view.navigation.common.list.List",
        "Job.view.navigation.common.query.QueryBase",
        "Job.view.navigation.task.manage.ManageController",
        "Job.view.navigation.task.manage.ManageModel"
    ],

    controller: "Job.view.navigation.task.manage.ManageController",
    viewModel: "Job.view.navigation.task.manage.ManageModel",

    initComponent: function(){
        var me = this;

        me.items = [{
            xtype: "panel",
            cls: "shadow-panel",
            bodyPadding: 15,
    
            items: [{
                xtype: "xtype_queryBase",
                query_what: "流程",
                listeners: {
                    query: "doQuery"
                }
            },{
                xtype: "xtype_list",
                bind: {
                    store: "{store_grid_procedure}"
                },
    
                columns: {
                    defaults: {
                        sortable:false,
                        menuDisabled:true,
                        resizable:false,
                        focusCls: ""
                    },
    
                    items: [{
                        text: "流程名称",
                        dataIndex: "name",
                        flex: 3
                    },{
                        text: "创建人",
                        dataIndex: "create_user",
                        flex: 2
                    },{
                        text: "创建时间",
                        dataIndex: "create_time",
                        flex: 2,
                        minWidth: 150
                    },{
                        text: "最后修改人",
                        dataIndex: "last_user",
                        flex: 2
                    },{
                        text: "最后修改时间",
                        dataIndex: "last_time",
                        flex: 2,
                        minWidth: 150
                    },{
                        xtype: "widgetcolumn",
                        text: "操作",
                        align: "center",
                        dataIndex: "asdfasdf",
                        flex: 3,
                        minWidth: 250,
    
                        widget: {
                            xtype: "container",
    
                            layout: {
                                type: "hbox",
                                pack: "center",
                                align: "stretch"
                            },
    
                            defaults: {
                                xtype: "button",
                                padding: 0,
                                height: 20,
                                width: 50,
                                scope: me.getController()
                            },
            
                            items: [{
                                text: "执行",
                                ui: "soft-cyan",
                                margin: "0 10 0 0",
                                handler: "preview"
                            },{
                                text: "编辑",
                                ui: "blue",
                                margin: "0 10 0 0",
                                handler: "edit"
                            },{
                                text: "克隆",
                                ui: "blue",
                                margin: "0 10 0 0",
                                handler: "clone"
                            },{
                                text: "删除",
                                ui: "soft-purple",
                                handler: "delete"
                            }]
                        }
                    }]
                }
            }]
        }];

        me.callParent();
    }
});