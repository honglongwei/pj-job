Ext.define("Job.view.navigation.task.manage.PreviewController", {
    extend: "Job.view.navigation.task.common.procedure.ProcedureController",
    alias: "controller.Job.view.navigation.task.manage.PreviewController",

    run: function(){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        
        var procedure_id = this.getView().procedure_id;

        Ext.Ajax.request({
            url: "/task/procedure/run.action",
            params: {
                "project_id": project_id,
                "procedure_id": procedure_id
            },
            scope: this,
            callback_complete: function(result){
                var task_id = result["data"];
                this.open_task_history(project_id, task_id);
            }
        });  
    }
});