Ext.define("Job.view.header.project.ProjectModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.header.project.ProjectModel",

    stores: {
        store_combo_project: {
            storeId: "store_combo_header_project",
            fields: ["id", "name"],
            data: []
        }
    }
});
