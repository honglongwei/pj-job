Ext.define("Job.view.header.project.ProjectController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.header.project.ProjectController",

    get_data: function(object){
        var store = Ext.getStore("store_combo_header_project");
        var project = Job.data.Session.getProject();
        store.setData(project);
    },

    select: function(object){
        var data = this.getViewModel().getData();
        var current_view = data.current_view;
        if(current_view){
            var event = "project_changed";
            if(current_view.hasListener(event)){
                current_view.fireEvent(event, object.getValue());
            }else{
                Job.resetNavigation();
            }
        }
    }
});