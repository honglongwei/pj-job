Ext.define("Job.view.common.scripteditor.ScripteditorController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.common.scripteditor.ScripteditorController",

    setup: function(){
        var segmentedbutton = this.lookupReference("ref_segmentedbutton_type");
        var button = this.lookupReference("ref_button_bash");
        segmentedbutton.fireEventArgs("toggle", [segmentedbutton, button]);
    },

    select_change: function(object, record){
        var view = this.getView();
        var editor = this.lookupReference("ref_aceeditor");

        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        var script_id = record.get("id");
        Ext.Ajax.request({
            url: "/manage/script/get.action",
            params: {
                "project_id": project_id,
                "script_id": script_id
            },
            callback_complete: function(result){
                var data = result["data"];
                var content = data["content"];
                var type = data["type"];

                editor.setValue(content);
                view.setType(type);
            }
        });
    },

    change_type: function(object, button, isPressed, eOpts){
        var type = button.value;
        object.value = type;
        this.set_template(type);
        this.set_type(type);
    },

    set_type: function(type){
        var editor = this.lookupReference("ref_aceeditor");
        switch(type){
            case 1:
                editor.setMode("sh");
                break;

            case 2:
                editor.setMode("batchfile");
                break;

            case 3:
                editor.setMode("python");
                break;

            default:
                break;
        }
    },

    set_template: function(type){
        var view = this.getView();

        if(Job.scriptTemplateEnable == false){
            return;
        }

        if(view.sourceDisabled){
            return;
        }
        if(view.isClone()){
            return;
        }

        var editor = this.lookupReference("ref_aceeditor");
        var project_id = Job.getProjectId(false);
        if(project_id == null){
            return;
        }
        Ext.Ajax.request({
            url: "/manage/script/template.action",
            params: {
                "project_id": project_id,
                "type": type
            },
            callback_complete: function(result){
                var data = result["data"];
                editor.setValue(data);
            }
        });
    },

    change_source: function(object, newValue, oldValue, eOpts){
        var panel = this.lookupReference("ref_panel_clone")
        var view = this.getView();

        switch(view.isClone()){
            case false:
                panel.setHidden(true)
                break;

            case true:
                var store = Ext.getStore("Job.store.Script");
                store.load();
                panel.setHidden(false)
                break;

            default:
                return
        }
    }
});