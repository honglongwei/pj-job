Ext.define("Job.view.navigation.task.newprocedure.Newprocedure", {
    extend: "Job.view.navigation.task.common.procedure.Procedure",

    requires: [
        "Job.view.navigation.task.newprocedure.NewprocedureController"
    ],

    controller: "Job.view.navigation.task.newprocedure.NewprocedureController",

    listeners: {
        afterrender: "setup"
    },

    initComponent: function(){
        this.callParent();
        Job.scriptTemplateEnable = true;
    }
});
