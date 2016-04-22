Ext.define("Job.store.Task", {
    extend: "Ext.data.Store",

    storeId: "Job.store.Task",

    listeners: {
        beforeload: function(store, operation){
            var project_id = Job.getProjectId(true);
            if(project_id == null){
                return false;
            }
            
            this.getProxy().setExtraParam("project_id", project_id);
            return true;
        }
    },

    fields: ["id", "name", "user", "status", "start_time", "end_time", "type", "total_time"],
    pageSize: 15,
    data: [],
    proxy: {
        type: "ajax",
        actionMethods: {read: "POST"},
        api: {
            read: "/history/show.action"
        },
        reader: {
            type: "json",
            rootProperty: "data"
        }
    }
});