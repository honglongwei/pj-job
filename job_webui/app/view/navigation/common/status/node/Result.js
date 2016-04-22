Ext.define("Job.view.navigation.common.status.node.Result", {
    extend: "Ext.panel.Panel",

    requires: [
        "Job.view.navigation.common.status.node.ResultModel",
        "Job.view.navigation.common.status.node.ResultController",
        "Job.view.navigation.common.aceeditor.Panel"
    ],

    viewModel: "Job.view.navigation.common.status.node.ResultModel",
    controller: "Job.view.navigation.common.status.node.ResultController",

    xtype: "xtype_result",
    title: "执行结果",
    bodyPadding: 10,
    referenceHolder: true,

    layout: {
        type: "vbox",
        pack: "start",
        align: "stretch"
    },

    items: [{
        xtype: "container",
        layout: {
            type: "hbox",
            pack: "start",
            align: "stretch"
        },

        items: [{
            xtype: "textfield",
            flex: 1
        },{
            xtype: "button",
            text: "搜索日志",
            margin: "0 0 0 10",
            iconCls: "x-fa fa-search"
        }]
    },{
        xtype: "container",
        margin: "15 0 0 0",
        flex: 1,
        layout: {
            type: "hbox",
            pack: "start",
            align: "stretch"
        },

        items: [{
            xtype: "grid",
            reference: "ref_grid_server",
            margin: "0 15 0 0",
            columnLines: true,
            style: "border-color: #d0d0d0; border-width: 1px; border-style: solid;",
            flex: 3,
            viewConfig: {
                markDirty: false
            },
            listeners: {
                afterrender: "select_first",
                selectionchange: "get_log"
            },
            bind: {
                store: "{store_grid_server}"
            },

            columns: {
                defaults: {
                    sortable:false,
                    menuDisabled:true,
                    resizable:false,
                    focusCls: ""
                },

                items: [{
                    text: "主机",
                    dataIndex: "host",
                    flex: 2
                },{
                    text: "返回码",
                    dataIndex: "code",
                    flex: 1
                },{
                    text: "耗时(s)",
                    dataIndex: "total_time",
                    flex: 1
                }]
            }
        },{
            xtype: "aceeditor",
            flex: 7,
            readOnly: true,
            theme: "textmate",
            fontSize: "13px",
            parser: "text",
            style: "border-color: #d0d0d0; border-width: 1px; border-style: solid;",
            bind: {
                value: "{log}"
            }
        }]
    }]
});