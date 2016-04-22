Ext.define("Job.view.navigation.dashboard.TaskListController",{
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.dashboard.TaskListController",

    more: function(){
        var view = "Job.view.navigation.history.History";
        Job.changeNavigation(view);
    }
});