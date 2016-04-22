Ext.define("Job.view.navigation.common.status.node.ResultModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.common.status.node.ResultModel",

    data: {
        log: ""
    },

    stores: {
        store_grid_server: {
            fields: ["id", "host", "code", "total_time"]
        }
    }
});