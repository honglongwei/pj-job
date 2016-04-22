Ext.define("Job.view.navigation.common.status.node.ResultController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.common.status.node.ResultController",

    select_first: function(object){
        var record = this.getViewModel().getStore("store_grid_server").getAt(0);
        object.getSelectionModel().select(record);
    },

    get_log: function(object, selected){
        var record = selected[0];
        var server_id = record.get("id");
        var project_id = Job.getProjectId(false);
        var viewmodel = this.getViewModel();

        Ext.Ajax.request({
            url: "/history/getServer.action",
            params: {
                "project_id": project_id,
                "server_id": server_id
            },
            callback_complete: function(result){
                var data = result["data"];
                viewmodel.set("log", data);
            }
        });
    }
});