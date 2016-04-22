Ext.define("Job.view.navigation.dashboard.DashboardController",{
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.dashboard.DashboardController",

    get_data: function(){
        var project_id = Job.getProjectId(false);

        if(project_id != null){
            this.project_changed(project_id);
        }else{
            return;
        }
    },

    project_changed: function(project_id){
        var info = this.lookupReference("ref_info");
        var tasklist = this.lookupReference("ref_tasklist");

        Ext.Ajax.request({
            url: "/dashboard/get.action",
            params: {
                "project_id": project_id
            },
            callback_complete: function(result){
                var data = result["data"];
                var tasks_data = data["tasks"];
                var info_data = data["info"];

                info.setData(info_data);
                tasklist.setData(tasks_data);
            }
        });
    }
});