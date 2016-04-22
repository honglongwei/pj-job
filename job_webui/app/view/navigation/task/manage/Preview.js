Ext.define("Job.view.navigation.task.manage.Preview", {
    extend: "Job.view.navigation.task.common.procedure.Procedure",

    requires: [
        "Job.view.navigation.task.manage.PreviewController"
    ],

    controller: "Job.view.navigation.task.manage.PreviewController",

    readOnly: true,
    showBack: true,

    initComponent: function(){
        this.callParent();
        Job.scriptTemplateEnable = false;
    }
});