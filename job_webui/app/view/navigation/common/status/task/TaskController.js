Ext.define("Job.view.navigation.common.status.task.TaskController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.common.status.task.TaskController",

    select_change: function(combo, record){
        var task_id = record.get("id");
        var project_id = Job.getProjectId(false);
        var view = this.getView();
        var list = this.lookupReference("ref_container_list");

        Ext.Ajax.request({
            url: "/history/getTask.action",
            params: {
                "project_id": project_id,
                "task_id": task_id
            },
            callback_complete: function(result){
                var task = result["data"];
                list.removeAll();
                view.build(task);
            }
        });
    },

    add_step: function(id, creater, index, last){
        var task_list = this.lookupReference("ref_container_list");
        var step = Ext.create("Job.view.navigation.common.status.step.Step",{
            creater: creater,
            isLast: last,
            step_index: index,
            step_id: id
        });

        task_list.add(step);
        return step;
    }
});