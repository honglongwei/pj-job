Ext.define("Job.view.navigation.common.status.node.StepController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.common.status.node.StepController",

    get_script: function(object){
        var project_id = Job.getProjectId(false);
        var node_id = this.getView().node_id;
        var viewmodel = this.getViewModel();

        Ext.Ajax.request({
            url: "/history/getStep.action",
            params: {
                "project_id": project_id,
                "node_id": node_id
            },
            callback_complete: function(result){
                var data = result["data"];
                var args = data["args"];
                var type = data["type"];
                var content = data["content"];

                viewmodel.setData({
                    args: args,
                    script: content,
                    type: type
                });
            }
        });
    }
});