Ext.define("Job.view.navigation.history.HistoryController", {
    extend: "Job.view.navigation.common.manage.ManageController",
    alias: "controller.Job.view.navigation.history.HistoryController",

    requires: [
        "Job.view.navigation.common.status.task.Task"
    ],

    doQuery: function(values){
        var store = Ext.getStore("Job.store.Task");
        var project_id = Job.getProjectId(false);

        Ext.Ajax.request({
            url: "/history/search.action",
            params: values,
            callback_complete: function(result){
                var data = result["data"];
                store.setData(data);
            }
        });
    },

    look: function(object){
        var view = this.getView();
        var record = object.up().getWidgetRecord();
        var task_id = record.get("id");
        var project_id = Job.getProjectId(false);

        Ext.Ajax.request({
            url: "/history/getTask.action",
            params: {
                "project_id": project_id,
                "task_id": task_id
            },
            callback_complete: function(result){
                var task = result["data"];
                var status = task["status"];

                var page = Ext.create("Job.view.navigation.common.status.task.Task", {
                    creater: view,
                    session: {
                        task_id: task_id
                    }
                });

                var combo = page.lookupReference("ref_combobox_task");
                combo.setValue(task_id);
                
                page.build(task);
                Job.addPage(page);
                if(status == 0){
                    page.poll();
                }
            }
        });
    }
});
