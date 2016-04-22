Ext.define("Job.view.navigation.task.manage.EditController", {
    extend: "Job.view.navigation.task.common.procedure.ProcedureController",
    alias: "controller.Job.view.navigation.task.manage.EditController",

    save: function(object){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        
        var procedure_id = this.getView().procedure_id;
        var procedure_obj = this.get_data();

        if(!procedure_obj){
            return;
        }

        Ext.Ajax.request({
            url: "/task/procedure/save.action",
            params: {
                "project_id": project_id,
                "procedure_id": procedure_id,
                "procedure": JSON.stringify(procedure_obj)
            }
        });
    }
});
