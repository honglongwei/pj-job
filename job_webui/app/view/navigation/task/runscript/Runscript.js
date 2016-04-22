Ext.define("Job.view.navigation.task.runscript.Runscript", {
    extend: "Ext.container.Container",

    requires: [
        "Job.view.navigation.task.runscript.RunscriptController",
        "Job.view.navigation.task.runscript.RunscriptModel",
        "Job.view.navigation.common.scripteditor.Scripteditor",
        "Ext.form.RadioGroup"
    ],

    listeners: {
        afterrender: "get_data"
    },

    viewModel: "Job.view.navigation.task.runscript.RunscriptModel",
    controller: "Job.view.navigation.task.runscript.RunscriptController",

    bodyPadding: 40,
    layout: "responsivecolumn",
    height: 800,
    referenceHolder: true,

    initComponent: function(){
        Job.scriptTemplateEnable = true;
        this.callParent();
    },

    items: [{
        xtype: "panel",
        cls: "shadow-panel",
        bodyPadding: "30 100 0 100",

        items: [{
            xtype: "textfield",
            labelWidth: 80,
            fieldLabel: "脚本名称",
            value: "执行脚本",
            reference: "ref_textfield_name",
            allowBlank: false,
            maxLength: 200,
            maxLengthText: "不能超过{0}个字符",
            width: 800
        },{
            xtype: "container",
            width: 800,

            layout: {
                type: "hbox",
                pack: "start",
                align: "stretch"
            },

            items: [{
                xtype: "combobox",
                fieldLabel: "执行账户",
                reference: "ref_combobox_user",
                emptyText: "请选择执行用户",
                margin: "0 0 0 0",
                labelWidth: 80,
                allowBlank: false,
                editable: false,
                queryMode: "local",
                store: "Job.store.User",
                displayField: "name",
                valueField: "id",
                flex: 1
            },{
                xtype: "button",
                margin: "0 0 0 10",
                iconCls: "x-fa fa-plus",
                handler: "show_add_user"
            }]
        },{
            xtype: "panel",
            frame: true,
            margin: "8 0 0 85",
            reference: "ref_panel_user",
            width: 715,
            hidden: true,
            
            layout: {
                type: "hbox",
                pack: "start",
                align: "middle"
            },
    
            items: [{
                xtype: "textfield",
                labelWidth: 60,
                fieldLabel: "账户名称",
                margin: "10 0 10 30",
                emptyText: "请输入账户名称",
                reference: "ref_textfield_user",
                allowBlank: false,
                minLength: 3,
                minLengthText: "不得少于{0}个字符!",
                maxLength: 40,
                maxLengthText: "不许闹!{0}个最多!",
                width: 500
            },{
                xtype: "button",
                text: "添加账户",
                margin: "0 0 0 20",
                handler: "add_user"
            }]
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
                handler: "show_cmdb"
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
            hidden: true,
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
                            handler: "delete"
                        }]
                    }
                }]
            }
        },{
            xtype: "textfield",
            labelWidth: 80,
            margin: "8 0 0 0",
            fieldLabel: "脚本参数",
            reference: "ref_textfield_args",
            maxLength: 200,
            maxLengthText: "不能超过{0}个字符",
            width: 800
        },{
            xtype: "scripteditor",
            reference: "ref_scripteditor_editor"
        },{
            xtype: "button",
            text: "执行脚本",
            margin: "20 0 30 400",
            iconCls: "x-fa fa-hand-o-right",
            handler: "run"
        }]
    }],

    updateServer: function(records){
        var store = this.getViewModel().getStore("store_grid_server");
        var grid = this.lookupReference("ref_grid_server");

        if(records.length){
            store.setData(records);
            grid.setHidden(false);
        }
    }
});
