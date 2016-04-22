Ext.define("Job.view.navigation.common.status.step.StepModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.common.status.step.StepModel",

    data: {
        name: ""
    },

    stores: {
        store_grid_step: {
            fields: ["id", "name", "num", "start_time", "end_time", "total_time", "status"],
            data: []
        }
    }
});