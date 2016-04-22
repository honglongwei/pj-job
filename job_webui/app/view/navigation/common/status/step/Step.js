Ext.define("Job.view.navigation.common.status.step.Step", {
    extend: "Ext.container.Container",

    requires: [
        "Job.view.navigation.common.status.step.StepModel",
        "Job.view.navigation.common.status.step.StepController"
    ],

    controller: "Job.view.navigation.common.status.step.StepController",
    viewModel: "Job.view.navigation.common.status.step.StepModel",

    creater: null,
    isLast: false,
    step_index: 1,
    step_id: null,
    referenceHolder: true,

    layout: {
        type: "hbox",
        pack: "start",
        align: "stretch"
    },

    initComponent: function(){
        var me = this;
        var isLast = me.isLast;
        var step_index = me.step_index;

        me.items = [{
            xtype: "container",
            width: 60,
            cls: isLast ? "" : "line-item",
            html: "<div class='line-index'>" + step_index + "</div>"
        },{
            xtype: "grid",
            trackMouseOver: false,
            disableSelection: true,
            margin: "0 0 40 0",
            frame: true,
            flex: 1,
            columnLines: true,
            viewConfig: {
                markDirty: false
            },
            title: {
                bind: "步骤名称&nbsp;:&nbsp;&nbsp; {name}",
                style: {
                    "color": "white",
                    "font-size": "14px"
                }
            },
            header: {
                padding: 0,
                titlePosition: 1,
                items: [{
                    xtype: "image",
                    src: "resources/images/icons/script.png",
                    alt: "脚本",
                    height: 41,
                    width: 41,
                    margin: "0 5 0 0"
                }]
            },
            bind: {
                store: "{store_grid_step}"
            },

            columns: {
                defaults: {
                    sortable:false,
                    menuDisabled:true,
                    resizable:false,
                    focusCls: ""
                },
        
                items: [{
                    xtype: "rownumberer",
                    text: "序号"
                },{
                    text: "脚本名称",
                    dataIndex: "name",
                    flex: 3
                },{
                    text: "主机数",
                    dataIndex: "num",
                    flex: 1,
                    minWidth: 60
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
                    text: "耗时",
                    dataIndex: "total_time",
                    flex: 1,
                    minWidth: 60
                },{
                    text: "状态",
                    dataIndex: "status",
                    flex: 1,
                    minWidth: 90,

                    renderer: function(value, metaData){
                        var button_info = metaData.record.button_info;
                        var button_ignore = metaData.record.button_ignore;
                        var button_retry = metaData.record.button_retry;

                        switch(value){
                            case 0:
                                if(button_info && button_ignore && button_retry){
                                    button_info.setHidden(true);
                                    button_ignore.setHidden(true);
                                    button_retry.setHidden(true);
                                }

                                return "<span class='font-runing'>等待执行</span>";
                                break;

                            case 1:
                                if(button_info && button_ignore && button_retry){
                                    button_info.setHidden(false);
                                    button_ignore.setHidden(true);
                                    button_retry.setHidden(true);
                                }
                                
                                return "<span class='font-success'>执行成功</span>";
                                break;

                            case 2:
                                if(button_info && button_ignore && button_retry){
                                    button_info.setHidden(false);
                                    button_ignore.setHidden(false);
                                    button_retry.setHidden(false);
                                }

                                return "<span class='font-fail'>执行失败</span>";
                                break;

                            case 3:
                                if(button_info && button_ignore && button_retry){
                                    button_info.setHidden(false);
                                    button_ignore.setHidden(true);
                                    button_retry.setHidden(true);
                                }

                                return "<span class='font-warning'>忽略错误</span>";
                                break;

                            case 10:
                                if(button_info && button_ignore && button_retry){
                                    button_info.setHidden(true);
                                    button_ignore.setHidden(true);
                                    button_retry.setHidden(true);
                                }

                                return "<span class='font-runing'>正在执行</span>";
                                break;

                            default:
                                break;
                        }
                    }
                },{
                    xtype: "widgetcolumn",
                    text: "操作",
                    align: "center",
                    dataIndex: "some_action",
                    flex: 3,
                    minWidth: 250,

                    widget: {
                        xtype: "container",

                        layout: {
                            type: "hbox",
                            pack: "start",
                            align: "stretch"
                        },

                        defaults: {
                            xtype: "button",
                            padding: 0,
                            height: 20,
                            hidden: true,
                            scope: me.getController()
                        },
        
                        items: [{
                            text: "执行详情",
                            ui: "blue",
                            margin: "0 10 0 0",
                            handler: "look",
                            listeners: {
                                afterrender: function(){
                                    var record = this.up().getWidgetRecord();
                                    record.button_info = this;

                                    var status = record.get("status");
                                    if(status != 0){
                                        this.setHidden(false);
                                    }
                                }
                            }
                        },{
                            text: "忽略错误",
                            ui: "soft-purple",
                            margin: "0 10 0 0",
                            handler: "ignore",
                            listeners: {
                                afterrender: function(){
                                    var record = this.up().getWidgetRecord();
                                    record.button_ignore = this;

                                    var status = record.get("status");
                                    if(status != 0){
                                        this.setHidden(false);
                                    }
                                }
                            }
                        },{
                            text: "失败主机重做",
                            ui: "soft-purple",
                            handler: "retry",
                            listeners: {
                                afterrender: function(){
                                    var record = this.up().getWidgetRecord();
                                    record.button_retry = this;

                                    var status = record.get("status");
                                    if(status != 0){
                                        this.setHidden(false);
                                    }
                                }
                            }
                        }]
                    }
                }]
            }
        }];

        me.callParent();
    }
});