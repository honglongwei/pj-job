Ext.define("Job.view.navigation.task.common.server.ServerController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.task.common.server.ServerController",

    requires: [
        "Job.view.navigation.task.common.server.cmdb.Cmdb"
    ],

    add: function(){
        var creater = this.getView().creater;
        var tabpanel = this.lookupReference("ref_tabpanel");
        var activetab = tabpanel.getActiveTab();
        var servers = activetab.getServer();

        creater.updateServer(servers);
        this.getView().close();
    },

    close: function(){
        this.getView().close();
    }
});
