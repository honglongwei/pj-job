Ext.define("Job.view.navigation.task.common.scriptstep.ScriptstepModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.task.common.scriptstep.ScriptstepModel",

    stores: {
        store_grid_node: {
            model: "Job.model.Scriptnode",
            data: []
        },
        store_grid_server: {
            model: "Job.model.Server",
            data: []
        }
    }
});
