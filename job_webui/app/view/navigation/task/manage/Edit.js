Ext.define("Job.view.navigation.task.manage.Edit", {
    extend: "Job.view.navigation.task.common.procedure.Procedure",

    requires: [
        "Job.view.navigation.task.manage.EditController"
    ],

    controller: "Job.view.navigation.task.manage.EditController",

    readOnly: false,
    showBack: true,

    initComponent: function(){
        this.callParent();
        Job.scriptTemplateEnable = false;
    }
});