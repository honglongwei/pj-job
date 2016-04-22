Ext.define("Job.store.User", {
    extend: "Ext.data.Store",

    storeId: "Job.store.User",

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
    
    fields: ["id", "name", "create_user", "create_time"],
    data: [],
    proxy: {
        type: "ajax",
        actionMethods: {read: "POST"},
        api: {
            read: "/manage/user/show.action"
        },
        reader: {
            type: "json",
            rootProperty: "data"
        }
    }
});