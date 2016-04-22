Ext.define("Job.view.navigation.task.common.server.cmdb.CmdbController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.task.common.server.cmdb.CmdbController",

    setup: function(){
        this.getData(true);
    },

    refresh: function(){
        this.getData(false);
    },

    getData: function(cache){
        var store = this.getViewModel().getStore("store_grid_server");
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }

        store.load({
            params: {project_id: project_id, cache: cache}
        });
    }
});