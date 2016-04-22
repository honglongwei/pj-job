Ext.define("Job.view.navigation.task.manage.Clone", {
    extend: "Job.view.navigation.task.common.procedure.Procedure",

    readOnly: false,
    showBack: true,

    initComponent: function(){
        this.callParent();
        Job.scriptTemplateEnable = false;
    }
});