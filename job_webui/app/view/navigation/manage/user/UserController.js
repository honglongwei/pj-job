Ext.define("Job.view.navigation.manage.user.UserController", {
    extend: "Job.view.navigation.common.manage.ManageController",
    alias: "controller.Job.view.navigation.manage.user.UserController",

    add: function(object){
        var grid = this.lookupReference("ref_grid_list");
        var store = grid.getStore();

        var textfield_user = this.lookupReference("ref_textfield_user");
        if (!textfield_user.isValid()){
            return;
        }

        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        var username = textfield_user.getValue();

        Ext.Ajax.request({
            url: "/manage/user/add.action",
            params: {
                "project_id": project_id,
                "name": username
            },
            callback_complete: function(result){
                store.reload({
                    params: {"project_id": project_id}
                });
            }
        });
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

    delete_users: function(users){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        var store = Ext.getStore("Job.store.User");

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
                            url: "/manage/user/delete.action",
                            params: {
                                "project_id": project_id,
                                "users_id": JSON.stringify(users)
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

        users_id = [];
        Ext.each(records, function(rec){
            users_id.push(rec.get("id"));
        });

        this.delete_users(users_id);
    },

    delete_one: function(object){
        var record = object.up().getWidgetRecord();
        user_id = record.get("id");

        this.delete_users([user_id]);
    },

    doQuery: function(values){
        var store = Ext.getStore("Job.store.User");

        Ext.Ajax.request({
            url: "/manage/user/search.action",
            params: values,
            callback_complete: function(result){
                var data = result["data"];
                store.setData(data);
            }
        });
    }
});
