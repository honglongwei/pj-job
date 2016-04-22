Ext.define("Job.view.navigation.manage.script.EditController",{
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.manage.script.EditController",

    close: function(object){
        this.getView().close();
    },

    save: function(object){
        var me = this.getView();
        var actionUrl = me.actionUrl;
        var project_id = Job.getProjectId(true);
        var textfield = this.lookupReference("ref_textfield_scriptname");
        var editor = this.lookupReference("ref_scripteditor_editor");

        if(!textfield.isValid()){
            return;
        }

        var script_id = me.script_id;
        var name = textfield.getValue();
        var content = editor.getContent();
        if(!content){
            Job.notify("warning", "请先编写脚本!");
            return;
        }

        var type = editor.getType();

        me.hide();
        Ext.Ajax.request({
            url: actionUrl,
            params: {
                "project_id": project_id,
                "script_id": script_id,
                "name": name,
                "content": content,
                "type": type
            },
            callback_complete: function(result){
                var store = Ext.getStore("Job.store.Script");
                store.reload();
                me.close();
            },
            callback_exception: function(){
                me.show();
            }
        });
    }
});
