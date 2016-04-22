Ext.define("Job.view.navigation.task.common.scriptstep.Scriptstep", {
    extend: "Ext.grid.Panel",

    requires: [
        "Job.view.navigation.task.common.scriptstep.ScriptstepController",
        "Job.view.navigation.task.common.scriptstep.ScriptstepModel",
        "Job.view.navigation.task.common.ux.UserCombobox",
        "Job.view.navigation.common.scripteditor.Scripteditor"
    ],

    controller: "Job.view.navigation.task.common.scriptstep.ScriptstepController",
    viewModel: "Job.view.navigation.task.common.scriptstep.ScriptstepModel",

    title: {
        hidden: true
    },
    readOnly: false,
    type: 1,
    xtype: "scriptstep",
    frame: true,
    trackMouseOver: false,
    disableSelection: true,
    referenceHolder: true,
    bind: {
        store: "{store_grid_node}"
    },
    margin: "0 0 20 0",
    viewConfig: {
        stripeRows: false,
        markDirty: false,
        getRowClass: function(record, index, rowParams, store){
            return (record.get("valid") == false) ? "x-grid-item-selected" : "";
        }
    },

    initComponent: function(){
        var me = this;
        var readOnly = me.readOnly;

        me.closable = !readOnly;

        me.bbar = readOnly ? null : [{
            xtype: "button",
            text: "添加节点",
            iconCls: "x-fa fa-plus",
            handler: "add_node"
        }];

        me.header = {
            padding: "0 14 0 0",
            titlePosition: 1,
            items: [{
                xtype: "image",
                src: "resources/images/icons/script.png",
                alt: "脚本",
                height: 41,
                width: 41,
                margin: "0 5 0 0"
            },{
                xtype: "textfield",
                fieldLabel: "步骤名称",
                reference: "ref_textfield_name",
                readOnly: readOnly,
                allowBlank: false,
                maxLength: 200,
                labelWidth: 60,
                width: 300,
                labelStyle: "color: white"
            },{
                xtype: "tbspacer",
                flex: 1
            },{
                xtype: "button",
                iconCls: "x-fa fa-arrow-up",
                margin: "0 5 0 0",
                handler: me.move_up,
                disabled: readOnly
            },{
                xtype: "button",
                iconCls: "x-fa fa-arrow-down",
                margin: readOnly ? null : "0 10 0 0",
                handler: me.move_down,
                disabled: readOnly
            }]
        };

        me.columns = {
            defaults: {
                xtype: "widgetcolumn",
                flex: 1,
                sortable:false,
                menuDisabled:true,
                resizable:false,
                align: "center",
                focusCls: ""
            },

            items: [{
                text: "脚本名称",
                dataIndex: "name",
                widget: {
                    xtype: "textfield",
                    margin: "5 0 5 0",
                    readOnly: readOnly,
    
                    listeners: {
                        change: function(slider, value){
                            if(slider.getWidgetRecord){
                                var rec = slider.getWidgetRecord();
                                if(rec){
                                    rec.set("name", value);
                                }
                            }
                        }
                    }
                }
            },{
                text: "执行账户",
                dataIndex: "user",
                widget: {
                    xtype: "xtype_usercombobox",
                    margin: "5 0 5 0",
                    editable: false,
                    readOnly: readOnly,
                    displayField: "name",
                    valueField: "id",
                    emptyText: "还没选择用户",
                    queryMode: "local",
                    store: "Job.store.User",
                    listConfig: {
                        loadMask: false
                    },
                    valueConfig: {
                        emptyText: "请输入账户名称",
                        allowBlank: false,
                        minLength: 3,
                        maxLength: 40
                    },

                    listeners: {
                        add_value: "add_user",
                        select: function(slider, record){
                            if(slider.getWidgetRecord){
                                var rec = slider.getWidgetRecord();
                                if(rec){
                                    rec.set("user", record.get("id"));
                                }
                            }
                        }
                    }
                }
            },{ 
                text: "服务器数",
                dataIndex: "num_str",
    
                widget: {
                    xtype: "textfield",
                    margin: "5 0 5 0",
                    readOnly: true,
                    hideTrigger: readOnly,
    
                    triggers: {
                        copy: {
                            hideOnReadOnly: false,
                            cls: "x-form-copy-trigger",
                            handler: "copy"
                        },                    
                        paste: {
                            hideOnReadOnly: false,
                            cls: "x-form-paste-trigger",
                            handler: "paste"
                        }
                    }
                }
            },{
                text: "脚本参数",
                dataIndex: "args",
                widget: {
                    xtype: "textfield",
                    margin: "5 0 5 0",
                    readOnly: readOnly,

                    listeners: {
                        change: function(slider, value){
                            if(slider.getWidgetRecord){
                                var rec = slider.getWidgetRecord();
                                if(rec){
                                    rec.set("args", value);
                                }
                            }
                        }
                    }
                }
            },{
                text: "操作",
                dataIndex: "some_action",
    
                widget: {
                    xtype: "container",
                    height: 30,
    
                    layout: {
                        type: "hbox",
                        pack: "center",
                        align: "middle"
                    },
    
                    defaults: {
                        xtype: "button",
                        margin: "0 5 0 0",
                        padding: 0,
                        ui: "blue"
                    },
    
                    items: [{
                        iconCls: readOnly ? "x-fa fa-eye" : "x-fa fa-pencil",
                        listeners: {
                            scope: me.controller,
                            click: "edit"
                        }
                    },{
                        iconCls: "x-fa fa-arrow-up",
                        disabled: readOnly,
                        listeners: {
                            scope: me.controller,
                            click: "row_up"
                        }
                    },{
                        iconCls: "x-fa fa-arrow-down",
                        disabled: readOnly,
                        listeners: {
                            scope: me.controller,
                            click: "row_down"
                        }
                    },{
                        iconCls: "x-fa fa-times",
                        disabled: readOnly,
                        listeners: {
                            scope: me.controller,
                            click: "delete_note"
                        }
                    }]
                }
            }]
        };

        me.callParent();
    },

    close: function(){
        var me = this;

        var win = Ext.create("Ext.window.MessageBox", {
            draggable: false,
            resizable: false
        });

        win.show({
            message: "确认删除?",
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: "确认",
                no: "取消"
            },

            fn: function(btn) {
                switch(btn){
                    case "yes":
                        var if_close = me.if_close();

                        if(if_close){
                            me.destroy();
                        }

                        break;

                    case "no":
                        break;

                    default:
                        break;
                }
            }
        });
    },

    if_close: function(){
        return true;
    },

    move_up: function(){
        return;
    },

    move_down: function(){
        return;
    },

    getType: function(){
        return this.type;
    },

    getName: function(){
        var textfield = this.lookupReference("ref_textfield_name");
        if (!textfield.isValid()){
            return null;
        }
        return textfield.getValue();
    },

    setName: function(name){
        var textfield = this.lookupReference("ref_textfield_name");
        textfield.setValue(name);
    }
});
