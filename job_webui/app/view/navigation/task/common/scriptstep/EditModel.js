Ext.define("Job.view.navigation.task.common.scriptstep.EditModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.task.common.scriptstep.EditModel",

    stores: {
        store_grid_server: {
            model: "Job.model.Server",
            data: []
        }
    }
});
