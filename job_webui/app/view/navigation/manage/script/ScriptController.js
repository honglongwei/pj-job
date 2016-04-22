Ext.define("Job.view.navigation.manage.script.ScriptController", {
    extend: "Job.view.navigation.common.manage.ManageController",
    alias: "controller.Job.view.navigation.manage.script.ScriptController",

    create: function(object){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }

        Job.scriptTemplateEnable = true;
        var editor = Ext.create("Job.view.navigation.manage.script.Edit", {
            actionUrl: "/manage/script/add.action"
        }).show();
    },

    select_change: function(object){
        var button = this.lookupReference("ref_button_multidel");

        var has_select = object.hasSelection();
        if(has_select){
            button.setDisabled(false);
        }else{
            button.setDisabled(true);
        }
    },

    edit: function(object){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        var record = object.up().getWidgetRecord();
        var script_id = record.get("id");

        Ext.Ajax.request({
            url: "/manage/script/get.action",
            params: {
                "project_id": project_id,
                "script_id": script_id
            },
            callback_complete: function(result){
                var data = result["data"];
                var name = data["name"];
                var content = data["content"];
                var type = data["type"];

                Job.scriptTemplateEnable = false;
                var editor = Ext.create("Job.view.navigation.manage.script.Edit", {
                    actionUrl: "/manage/script/save.action",
                    script_id: script_id
                });
                var textfield = editor.lookupReference("ref_textfield_scriptname");
                textfield.setValue(name);

                var script_editor = editor.lookupReference("ref_scripteditor_editor");
                editor.show();
                script_editor.setType(type);
                script_editor.setContent(content);
            }
        });
    },

    delete_scripts: function(scripts){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        var store = Ext.getStore("Job.store.Script");

        var win = Ext.create("Ext.window.MessageBox", {
            draggable: false,
            resizable: false
        });

        win.show({
            message: "确认删除?",
            buttons: Ext.Msg.YESNO,
            buttonText: {
                yes: "确认",
                no: "取消"
            },

            fn: function(btn) {
                switch(btn){
                    case "yes":
                        Ext.Ajax.request({
                            url: "/manage/script/delete.action",
                            params: {
                                "project_id": project_id,
                                "scripts_id": JSON.stringify(scripts)
                            },
                            callback_complete: function(result){
                                store.reload({
                                    params: {"project_id": project_id}
                                });
                            }
                        });
                        break;

                    case "no":
                        break;

                    default:
                        break;
                }
            }
        });
    },

    delete_lot: function(object){
        var grid = this.lookupReference("ref_grid_list");
        records = grid.getSelectionModel().getSelection();

        scripts_id = [];
        Ext.each(records, function(rec){
            scripts_id.push(rec.get("id"));
        });

        this.delete_scripts(scripts_id);
    },

    delete_one: function(object){
        var record = object.up().getWidgetRecord();
        script_id = record.get("id");

        this.delete_scripts([script_id]);
    }
});
