Ext.define("Job.view.navigation.common.manage.ManageController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.common.manage.ManageController",

    get_data: function(){
        var grid = this.lookupReference("ref_grid_list");
        grid.fireEvent("get_data");
    },

    project_changed: function(project_id){
        var grid = this.lookupReference("ref_grid_list");
        grid.fireEvent("project_changed", project_id);
    },

    doQuery: function(values){
        console.log(values);
    }
});