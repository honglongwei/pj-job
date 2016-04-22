Ext.define("Job.view.navigation.common.list.ListController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.common.list.ListController",

    init: function(){
        var me = this;
        var view = me.getView();
        me.store = null;

        if(view.config.bind){
            var string = view.config.bind.store;
            me.store = me.getViewModel().getStore(string.substring(1, string.length - 1));
        }else{
            me.store = view.getStore();
        }
    },

    get_data: function(){
        var project_id = Job.getProjectId(false);

        if(project_id != null){
            this.project_changed(project_id);
        }else{
            return;
        }
    },

    project_changed: function(project_id){
        this.store.load({
            params: {"project_id": project_id}
        });
    }
});