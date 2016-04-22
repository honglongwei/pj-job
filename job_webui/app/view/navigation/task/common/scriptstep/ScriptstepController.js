Ext.define("Job.view.navigation.task.common.scriptstep.ScriptstepController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.task.common.scriptstep.ScriptstepController",

    add_user: function(object){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }

        if (!object.isValid()){
            return;
        }

        var username = object.getValue();
        var store = Ext.getStore("Job.store.User");

        Ext.Ajax.request({
            url: "/manage/user/add.action",
            params: {
                "project_id": project_id,
                "name": username
            },
            callback_complete: function(result){
                object.setValue(null);
                object.clearInvalid();

                store.reload({
                    params: {"project_id": project_id}
                });
            }
        });
    },
    
    edit: function(object){
        var me = this.getView();
        var name = null;
        var content = null;
        var type = null;
        var servers = null;

        var record = object.up().getWidgetRecord();
        content = record.get("content") || "";
        type = record.get("type") || 1;
        servers = record.getServerStore().getRange();

        if(content){
            Job.scriptTemplateEnable = false;
        }else{
            Job.scriptTemplateEnable = true;
        }

        var win = Ext.create("Job.view.navigation.task.common.scriptstep.Edit", {
            record: record,
            readOnly: me.readOnly
        }).show();
        win.update(content, type, servers);
    },

    delete_note: function(object){
        var me = this.getView();

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
                        var store = me.getStore();
                
                        if(store.count() == 1){
                            Job.notify("warning","步骤中至少需要一个节点");
                            return;
                        }
                        var record = object.up().getWidgetRecord();
                
                        store.remove(record);

                        break;

                    case "no":
                        break;

                    default:
                        break;
                }
            }
        });
    },

    add_node: function(object){
        var me = this.getView();
        var store = me.getViewModel().getStore("store_grid_node");
        var model = store.getModel();
        var record = model.create();

        store.add(record);
    },

    row_up: function(object){
        var me = this.getView();
        var store = me.getStore();
        var record = object.up().getWidgetRecord();
        var index = store.indexOf(record);

        if(index > 0){
            store.removeAt(index);
            store.insert(index - 1, record); 
        }
    },

    row_down: function(object){
        var me = this.getView();
        var store = me.getStore();
        var record = object.up().getWidgetRecord();
        var index = store.indexOf(record);

        if(index < store.getCount() - 1){
            store.removeAt(index);  
            store.insert(index + 1, record); 
        }
    },

    copy: function(object){
        var record = object.getWidgetRecord();
        var server_records = record.getServerStore().getRange();

        var clipboard = Job.data.Clipboard;
        clipboard.set(server_records);
    },

    paste: function(object){
        var clipboard = Job.data.Clipboard;
        var record = object.getWidgetRecord();
        var server_store = record.getServerStore();

        var server_records = clipboard.get();
        if(server_records){
            server_store.setData(server_records);
            record.set("num", server_records.length);
        }
    }
});
