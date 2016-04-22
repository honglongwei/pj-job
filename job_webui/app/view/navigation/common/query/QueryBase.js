Ext.define("Job.view.navigation.common.query.QueryBase", {
    extend: "Ext.form.Panel",

    requires: [
        "Job.view.navigation.common.query.QueryBaseController"
    ],

    controller: "Job.view.navigation.common.query.QueryBaseController",

    xtype: "xtype_queryBase",
    frame: true,
    buttonAlign: "left",
    bodyPadding: "20 40 20 40",
    margin: "0 0 20 0",
    query_what: "",
    layout: {
        type: "hbox",
        pack: "start",
        align: "stretch"
    },

    initComponent: function(){
        var me = this;
        var query_what = me.query_what;

        me.items = [{
            xtype: "textfield",
            fieldLabel: query_what + "名称",
            name: "name",
            emptyText: "请输入" + query_what + "名称",
            labelWidth: 60,
            width: 260
        },{
            xtype: "tbspacer",
            flex: 1
        },{
            xtype: "textfield",
            fieldLabel: "创建人",
            name: "create_user",
            emptyText: "请输入创建人账号",
            reference: "ref_textfield_createUser",
            labelWidth: 50,
            width: 250
        },{
            xtype: "button",
            ui: "soft-green",
            text: "我",
            handler: "me"
        },{
            xtype: "tbspacer",
            flex: 1
        },{
            xtype: "datefield",
            fieldLabel: "创建时间",
            name: "create_time_start",
            labelWidth: 60,
            emptyText: "开始日期",
            submitFormat: "Y-m-d H:i:s",
            width: 220,
            margin: "0 10 0 0"
        },{
            xtype: "datefield",
            fieldLabel: "-",
            name: "create_time_end",
            labelSeparator: "",
            labelWidth: 10,
            emptyText: "结束日期",
            submitFormat: "Y-m-d H:i:s",
            width: 170,
            margin: "0 300 0 0"
        }];
    
        me.buttons = [{
            text: "查询",
            width: 90,
            iconCls: "x-fa fa-search",
            handler: "query"
        },{
            text: "重置",
            width: 90,
            iconCls: "x-fa fa-refresh",
            handler: "reset"
        }];

        me.callParent();
    }
});