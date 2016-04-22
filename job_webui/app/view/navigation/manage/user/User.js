Ext.define("Job.view.navigation.manage.user.User", {
    extend: "Job.view.navigation.common.manage.Manage",

    requires: [
        "Job.view.navigation.common.list.List",
        "Job.view.navigation.common.query.QueryBase",
        "Job.view.navigation.manage.user.UserController",
        "Ext.layout.container.Center"
    ],

    controller: "Job.view.navigation.manage.user.UserController",

    initComponent: function(){
        var me = this;

        me.items = [{
            xtype: "panel",
            cls: "shadow-panel",
            bodyPadding: 15,
    
            items: [{
                xtype: "xtype_queryBase",
                query_what: "账户",
                listeners: {
                    query: "doQuery"
                }
            },{
                xtype: "container",
                layout: "hbox",
    
                items: [{
                    xtype: "textfield",
                    emptyText: "请输入账户名称",
                    allowBlank: false,
                    minLength: 3,
                    minLengthText: "不得少于{0}个字符!",
                    maxLength: 40,
                    maxLengthText: "不许闹!{0}个最多!",
                    blankText: "必填!",
                    reference: "ref_textfield_user",
                    margin: "0 5 0 0"
                },{
                    xtype: "button",
                    iconCls: "x-fa fa-plus",
                    handler: "add"
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
                store: "Job.store.User",
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
                        text: "帐户名",
                        dataIndex: "name",
                        flex: 1
                    },{
                        text: "创建人",
                        dataIndex: "create_user",
                        flex: 1.5
                    },{
                        text: "创建时间",
                        dataIndex: "create_time",
                        flex: 2
                    },{
                        xtype: "widgetcolumn",
                        text: "操作",
                        align: "center",
                        dataIndex: "asdfasdf",
                        flex: 1,
    
                        widget: {
                            xtype: "container",
    
                            layout: "center",
    
                            defaults: {
                                xtype: "button",
                                padding: 0,
                                height: 20,
                                width: 50,
                                scope: me.getController()
                            },
            
                            items: [{
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
