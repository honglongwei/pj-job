Ext.define("Job.view.navigation.dashboard.DashboardModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.dashboard.DashboardModel",

    requires: [
        "Ext.data.Store",
        "Ext.data.field.Field",
        "Ext.app.bind.Formula"
    ],

    stores: {
        store_grid_task: {
            fields: ["id", "start_user", "start_time", "status", "name"]        
        }
    }
});
