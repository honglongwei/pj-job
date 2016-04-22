Ext.define("Job.view.navigation.task.common.scriptstep.EditController",{
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.task.common.scriptstep.EditController",

    show_server: function(object){
        var creater = this.getView();
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }

        Ext.create("Job.view.navigation.task.common.server.Server", {
            creater: creater
        }).show()
    },

    delete: function(object){
        var record = object.up().getWidgetRecord();
        var store = this.lookupReference("ref_grid_server").getStore();

        store.remove(record);
    },

    save: function(object){
        var editor = this.lookupReference("ref_scripteditor");
        var content = editor.getContent();
        var type = editor.getType();
        
        var grid = this.lookupReference("ref_grid_server");
        var store = grid.getStore();
        var servers = store.getRange();

        var record = this.getView().record;
        var server_store = record.getServerStore();
        var num = store.getCount();

        record.set("content", content);
        record.set("type", type);
        record.set("num", num);
        server_store.setData(servers);

        this.getView().close();
    },

    close: function(){
        this.getView().close();
    }
});
