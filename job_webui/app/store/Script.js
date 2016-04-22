Ext.define("Job.store.Script", {
    extend: "Ext.data.Store",

    storeId: "Job.store.Script",

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

    fields: ["id", "name", "create_user", "create_time", "last_user", "last_time"],
    data: [],
    proxy: {
        type: "ajax",
        actionMethods: {read: "POST"},
        api: {
            read: "/manage/script/show.action"
        },
        reader: {
            type: "json",
            rootProperty: "data"
        }
    }
});