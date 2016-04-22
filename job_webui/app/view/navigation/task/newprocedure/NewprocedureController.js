Ext.define("Job.view.navigation.task.newprocedure.NewprocedureController", {
    extend: "Job.view.navigation.task.common.procedure.ProcedureController",
    alias: "controller.Job.view.navigation.task.newprocedure.NewprocedureController",

    setup: function(){
        this.callParent();
        this.getView().addScriptstep(true);
    }
});
