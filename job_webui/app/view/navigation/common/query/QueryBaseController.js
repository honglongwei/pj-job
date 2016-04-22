Ext.define("Job.view.navigation.common.query.QueryBaseController",{
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.common.query.QueryBaseController",

    me: function(){
        var me = Job.data.Session.getName();
        this.lookupReference("ref_textfield_createUser").setValue(me);
    },

    reset: function(){
        this.getView().reset();
    },

    query: function(){
        var me = this.getView();
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        };

        var values = me.getValues();

        var has_value = false;
        for(var key in values){
            if(values[key]){
                values[key] = Ext.util.Format.trim(values[key]);
                if(values[key].length != 0){
                    has_value = true;
                }
            }
        };

        values["project_id"] = project_id;
        if(has_value){
            me.fireEvent("query", values);
        };
    }
});