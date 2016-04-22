Ext.define("Job.view.navigation.task.common.server.cmdb.CmdbModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.task.common.server.cmdb.CmdbModel",

    requires: [
        "Job.model.Server"
    ],

    stores: {
        store_grid_server: {
            model: "Job.model.Server",
            data: [],
            proxy: {
                type: "ajax",
                actionMethods: {read: "POST"},
                api: {
                    read: "/api/cmdb/get.action"
                },
                reader: {
                    type: "json",
                    rootProperty: "data"
                }
            }
        }
    }
});
