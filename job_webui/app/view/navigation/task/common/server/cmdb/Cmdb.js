Ext.define("Job.view.navigation.task.common.server.cmdb.Cmdb",{
    extend: "Ext.grid.Panel",

    requires: [
        "Job.view.navigation.task.common.server.cmdb.CmdbModel",
        "Job.view.navigation.task.common.server.cmdb.CmdbController"
    ],

    viewModel: "Job.view.navigation.task.common.server.cmdb.CmdbModel",
    controller: "Job.view.navigation.task.common.server.cmdb.CmdbController",

    listeners: {
        afterrender: "setup"
    },

    xtype: "xtype_cmdb",
    title: "资产系统",
    columnLines: true,
    selType: "checkboxmodel",
    selModel: {
        mode: "MULTI"
    },
    viewConfig: {
        markDirty: false,
        loadMask: false
    },

    bind: "{store_grid_server}",

    tbar: [{
        xtype: "combobox",
        fieldLabel: "分组",
        emptyText: "请选择分组",
        labelWidth: 30,
        disabled: true
    },"-",{
        xtype: "textfield",
        disabled: true
    },{
        xtype: "button",
        text: "搜索",
        disabled: true
    },"->",{
        xtype: "button",
        text: "刷新",
        handler: "refresh"
    }],

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
            flex: 3
        },{
            text: "大区",
            dataIndex: "zone",
            flex: 2
        },{
            text: "渠道",
            dataIndex: "channel",
            flex: 2
        },{
            text: "功能",
            dataIndex: "function",
            flex: 1
        },{
            text: "描述",
            dataIndex: "desc",
            flex: 3
        },{
            text: "客户端状态",
            dataIndex: "status",
            width: 100,
            align: "center",

            renderer: function(value, metaData){
                var value = value ? value : 0;

                switch(value){
                    case 0:
                        return "<span class='font-warning'>未检测</span>";
                        break;

                    case 1:
                        return "<span class='font-success'>正常</span>";
                        break;

                    case 2:
                        return "<span class='font-fail'>未安装</span>";
                        break;

                    default:
                        break;
                }
            }
        }]
    },

    getServer: function(){
        var me = this;
        var records = me.getSelectionModel().getSelection();

        return records;
    }
});
