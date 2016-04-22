Ext.define("Job.view.navigation.task.manage.ManageController", {
    extend: "Job.view.navigation.common.manage.ManageController",
    alias: "controller.Job.view.navigation.task.manage.ManageController",

    requires: [
        "Job.view.navigation.task.manage.Edit",
        "Job.view.navigation.task.manage.Preview",
        "Job.view.navigation.task.manage.Clone"
    ],

    delete: function(object){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        var store = this.getViewModel().getStore("store_grid_procedure");

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
                        var record = object.up().getWidgetRecord();

                        Ext.Ajax.request({
                            url: "/task/procedure/delete.action",
                            params: {
                                "project_id": project_id,
                                "procedure_id": record.get("id")
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

    create_view: function(object, view, is_clone, callback_when_back, callback_when_back_scope){
        var is_clone = arguments[2] ? true : false;
        var callback_when_back = arguments[3] ? callback_when_back : null;
        var callback_when_back_scope = arguments[4] ? callback_when_back_scope : null;

        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        var record = object.up().getWidgetRecord();
        var procedure_id = record.get("id");

        Ext.Ajax.request({
            url: "/task/procedure/get.action",
            params: {
                "project_id": project_id,
                "procedure_id": procedure_id
            },
            callback_complete: function(result){
                var procedure = result["data"];
                var page = Ext.create(view, {
                    callback_when_back: callback_when_back,
                    callback_when_back_scope: callback_when_back_scope
                });

                page.procedure_id = procedure_id;
                page.build(procedure, is_clone);
                Job.addPage(page);
            }
        });
    },

    callback_when_back: function(){
        this.getViewModel().getStore("store_grid_procedure").reload();
    },

    preview: function(object){
        var view = "Job.view.navigation.task.manage.Preview";
        this.create_view(object, view);
    },

    edit: function(object){
        var view = "Job.view.navigation.task.manage.Edit";
        this.create_view(object, view, false, this.callback_when_back, this);
    },

    clone: function(object){
        var view = "Job.view.navigation.task.manage.Clone";
        this.create_view(object, view, true, this.callback_when_back, this);
    },

    doQuery: function(values){
        var store = this.getViewModel().getStore("store_grid_procedure");
        var project_id = Job.getProjectId(false);

        Ext.Ajax.request({
            url: "/task/procedure/search.action",
            params: values,
            callback_complete: function(result){
                var data = result["data"];
                store.setData(data);
            }
        });
    }
});