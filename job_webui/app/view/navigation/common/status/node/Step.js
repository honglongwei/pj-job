Ext.define("Job.view.navigation.common.status.node.Step",{
    extend: "Ext.panel.Panel",

    requires: [
        "Job.view.navigation.common.status.node.StepController",
        "Job.view.navigation.common.status.node.StepModel",
        "Job.view.navigation.common.scripteditor.Scripteditor"
    ],

    listeners: {
        afterrender: "get_script"
    },

    viewModel: "Job.view.navigation.common.status.node.StepModel",
    controller: "Job.view.navigation.common.status.node.StepController",

    node_id: null,  //需要上层赋值
    xtype: "xtype_step",
    title: "步骤详情",
    bodyPadding: "30 0 20 80",
    autoScroll: true,
    referenceHolder: true,

    initComponent: function(){
        this.callParent();
        Job.scriptTemplateEnable = false;
    },

    items:[{
        xtype: "textfield",
        readOnly: true,
        labelWidth: 80,
        fieldLabel: "脚本参数",
        width: 800,
        bind: {
            value: "{args}"
        }
    },{
        xtype: "scripteditor",
        sourceDisabled: true,
        readOnly: true,
        bind: {
            content: "{script}",
            type: "{type}"
        }
    }]
})
