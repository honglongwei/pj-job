Ext.define("Job.view.navigation.task.manage.ManageModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.task.manage.ManageModel",

    stores: {
        store_grid_procedure: {
            fields: ["id", "name", "create_user", "create_time", "last_user", "last_time"],
            proxy: {
                type: "ajax",
                actionMethods: {read: "POST"},
                api: {
                    read: "/task/procedure/show.action"
                },
                reader: {
                    type: "json",
                    rootProperty: "data",
                    totalProperty: "total"
                }
            }
        }
    }
});
