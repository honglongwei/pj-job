Ext.define("Job.view.navigation.history.History", {
    extend: "Job.view.navigation.common.manage.Manage",

    requires: [
        "Job.view.navigation.common.list.List",
        "Job.view.navigation.common.query.QueryBase",
        "Job.view.navigation.history.HistoryController"
    ],

    controller: "Job.view.navigation.history.HistoryController",

    initComponent: function(){
        var me = this;

        me.items = [{
            xtype: "panel",
            cls: "shadow-panel",
            bodyPadding: 15,
    
            items: [{
                xtype: "xtype_queryBase",
                query_what: "任务",
                listeners: {
                    query: "doQuery"
                }
            },{
                xtype: "xtype_list",
                store: "Job.store.Task",
    
                columns: {
                    defaults: {
                        sortable:false,
                        menuDisabled:true,
                        resizable:false,
                        focusCls: ""
                    },
    
                    items: [{
                        text: "任务名称",
                        dataIndex: "name",
                        flex: 3
                    },{
                        text: "启动人",
                        dataIndex: "user",
                        flex: 2
                    },{
                        text: "任务状态",
                        dataIndex: "status",
                        flex: 1,
                        minWidth: 90,

                        renderer: function(value){
                            switch(value){
                                case 0:
                                    return "<span class='font-runing'>等待执行</span>";
                                    break;
    
                                case 1:
                                    return "<span class='font-success'>执行成功</span>";
                                    break;
    
                                case 2:
                                    return "<span class='font-fail'>执行失败</span>";
                                    break;

                                case 10:
                                    return "<span class='font-runing'>正在执行</span>";
                                    break;
    
                                default:
                                    break;
                            }
                        }
                    },{
                        text: "开始时间",
                        dataIndex: "start_time",
                        flex: 2,
                        minWidth: 150
                    },{
                        text: "结束时间",
                        dataIndex: "end_time",
                        flex: 2,
                        minWidth: 150
                    },{
                        text: "启动方式",
                        dataIndex: "type",
                        flex: 1,
                        minWidth: 80,

                        renderer: function(value){
                            switch(value){
                                case 1:
                                    return "页面启动";
                                    break;
    
                                default:
                                    break;
                            }
                        }
                    },{
                        text: "耗时",
                        dataIndex: "total_time",
                        flex: 1,
                        minWidth: 60
                    },{
                        xtype: "widgetcolumn",
                        text: "操作",
                        align: "center",
                        dataIndex: "asdfasdf",
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
                                scope: me.getController()
                            },
            
                            items: [{
                                text: "查看详情",
                                ui: "blue",
                                margin: "0 10 0 0",
                                handler: "look"
                            }]
                        }
                    }]
                }
            }]
        }];

        me.callParent();
    },

    reload: function(){
        this.lookupReference("ref_grid_list").lookupReference("ref_pagingtoolbar").doRefresh();
    }
});