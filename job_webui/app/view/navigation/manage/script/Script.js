Ext.define("Job.view.navigation.manage.script.Script", {
    extend: "Job.view.navigation.common.manage.Manage",

    requires: [
        "Job.view.navigation.common.list.List",
        "Job.view.navigation.common.query.QueryBase",
        "Job.view.navigation.manage.script.ScriptController"
    ],

    controller: "Job.view.navigation.manage.script.ScriptController",

    initComponent: function(){
        var me = this;

        me.items = [{
            xtype: "panel",
            cls: "shadow-panel",
            bodyPadding: 15,
    
            items: [{
                xtype: "xtype_queryBase",
                query_what: "脚本",
                listeners: {
                    query: "doQuery"
                }
            },{
                xtype: "container",
                layout: "hbox",

                items: [{
                    xtype: "button",
                    text: "新建脚本",
                    width: 100,
                    handler: "create"
                },{
                    xtype: "tbspacer",
                    flex: 1
                },{
                    xtype: "button",
                    reference: "ref_button_multidel",
                    disabled: true,
                    text: "批量删除",
                    handler: "delete_lot"
                }]
            },{
                xtype: "xtype_list",
                store: "Job.store.Script",
                selType: "checkboxmodel",
                selModel: {
                    mode: "MULTI",
                    listeners: {
                        scope: me.getController(),
                        selectionchange: "select_change"
                    }
                },
    
                columns: {
                    defaults: {
                        sortable:false,
                        menuDisabled:true,
                        resizable:false,
                        focusCls: ""
                    },
    
                    items: [{
                        text: "脚本名称",
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
                        dataIndex: "some_action",
                        flex: 3,
                        minWidth: 200,
    
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
                                text: "编辑",
                                ui: "blue",
                                margin: "0 10 0 0",
                                handler: "edit"
                            },{
                                text: "删除",
                                ui: "soft-purple",
                                handler: "delete_one"
                            }]
                        }
                    }]
                }
            }]
        }];

        me.callParent();
    }
});
