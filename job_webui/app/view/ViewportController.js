Ext.define("Job.view.ViewportController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.ViewportController",

    requires: [
        "Job.view.navigation.dashboard.Dashboard",
        "Job.view.navigation.manage.user.User",
        "Job.view.navigation.manage.script.Script",
        "Job.view.navigation.task.runscript.Runscript",
        "Job.view.navigation.task.newprocedure.Newprocedure",
        "Job.view.navigation.task.manage.Manage",
        "Job.view.navigation.history.History"
    ],

    open_view: function(view){
        var main = this.lookupReference("ref_container_main");
        var layout = main.getLayout();
        var data = this.getViewModel().getData();
        var last_view = data.current_view;
        var new_view = null;

        main.removeAll();

        new_view = Ext.create(view);
        layout.setActiveItem(main.add(new_view));
        data.current_view = new_view;
    },

    select_change: function(object, node){
        var view = node.get("view");
        this.open_view(view);
    },

    open_dashboard: function(){
        var view = "Job.view.navigation.dashboard.Dashboard";
        Job.changeNavigation(view);
    }
});