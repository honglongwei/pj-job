Ext.define("Job.view.navigation.manage.script.Edit",{
    extend: "Ext.window.Window",

    requires: [
        "Job.view.navigation.manage.script.EditController",
        "Job.view.navigation.common.scripteditor.Scripteditor"
    ],

    controller: "Job.view.navigation.manage.script.EditController",

    actionUrl: "",
    script_id: null,

    bodyPadding: 20,
    draggable: false,
    resizable: false,
    frame: true,
    modal: true,
    referenceHolder: true,

    initComponent: function(){
        var me = this;

        me.items = [{
            xtype: "textfield",
            labelWidth: 80,
            fieldLabel: "脚本名称",
            reference: "ref_textfield_scriptname",
            allowBlank: false,
            maxLength: 200,
            width: 800
        },{
            xtype: "scripteditor",
            reference: "ref_scripteditor_editor"
        }],
    
        me.buttons = [{
            xtype: "button",
            text: "保存",
            handler: "save"
        },{
            xtype: "button",
            text: "取消",
            handler: "close"
        }]

        me.callParent();
    }
})
