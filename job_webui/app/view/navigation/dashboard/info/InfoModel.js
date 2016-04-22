Ext.define("Job.view.navigation.dashboard.info.InfoModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.dashboard.info.InfoModel",

    data: {
        servers: 0,
        procedures: 0,
        status: {
            total: 0,
            runing: 0,
            success: 0,
            fail: 0
        }
    }
});