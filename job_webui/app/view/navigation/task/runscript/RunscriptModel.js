Ext.define("Job.view.navigation.task.runscript.RunscriptModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.task.runscript.RunscriptModel",

    stores: {
        store_grid_server: {
            model: "Job.model.Server",
            data: []
        }
    }
});
