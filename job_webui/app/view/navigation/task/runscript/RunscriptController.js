Ext.define("Job.view.navigation.task.runscript.RunscriptController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.task.runscript.RunscriptController",

    requires: [
        "Job.view.navigation.task.common.server.Server"
    ],

    get_data: function(){
        var store = Ext.getStore("Job.store.User");
        store.load();
    },

    add_user: function(){
        var store = Ext.getStore("Job.store.User");

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
                store.load();
            }
        });
    },

    show_cmdb: function(){
        var creater = this.getView();
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        
        Ext.create("Job.view.navigation.task.common.server.Server",{
            creater: creater
        }).show()
    },

    show_add_user: function(){
        this.lookupReference("ref_panel_user").setHidden(false);
    },

    delete: function(object){
        var record = object.up().getWidgetRecord();
        var server_store = this.lookupReference("ref_grid_server").getStore();

        server_store.remove(record);
    },

    run: function(){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }

        var name = null;
        var name_ob = this.lookupReference("ref_textfield_name");
        if (!name_ob.isValid()){
            Job.notify("info", "请先填写脚本称");
            return;
        }
        name = name_ob.getValue();

        var user = null;
        var user_ob = this.lookupReference("ref_combobox_user");
        if (!user_ob.isValid()){
            Job.notify("info", "请先选择用户");
            return;
        }
        user = user_ob.getValue();

        var args = this.lookupReference("ref_textfield_args").getValue();

        var editor = this.lookupReference("ref_scripteditor_editor");
        var content = editor.getContent();
        if(!content){
            Job.notify("info", "请先编写脚本");
            return;
        }

        var type = editor.getType();

        var store = this.getViewModel().getStore("store_grid_server");
        if(!store.count()){
            Job.notify("info", "请先选择服务器");
            return;
        }

        var servers = [];
        store.each(function(rec){
            servers.push(rec.get("host"));
        });

        var procedure_obj = {};
        procedure_obj.name = name;
        procedure_obj.steps = [{
            name: name,
            type: 1,
            nodes: [{
                name: name,
                user: user,
                args: args,
                content: content,
                type: type,
                servers: servers
            }]
        }];

        Ext.Ajax.request({
            url: "/task/procedure/runTemp.action",
            params: {
                "project_id": project_id,
                "procedure": JSON.stringify(procedure_obj)
            },
            scope: this,
            callback_complete: function(result){
                var task_id = result["data"];
                this.open_task_history(project_id, task_id);
            }
        });
    },

    open_task_history: function(project_id, task_id){
        Ext.Ajax.request({
            url: "/history/getTask.action",
            params: {
                "project_id": project_id,
                "task_id": task_id
            },
            scope: this,
            callback_complete: function(result){
                var task = result["data"];
                var node_id = task["steps"][0]["nodes"][0]["id"];
                this.open_node_history(project_id, node_id);
            }
        });
    },

    open_node_history: function(project_id, node_id){
        Ext.Ajax.request({
            url: "/history/getNode.action",
            params: {
                "project_id": project_id,
                "node_id": node_id
            },
            callback_complete: function(result){
                var data = result["data"];
                
                var page = Ext.create("Job.view.navigation.common.status.node.Node", {
                    node_id: node_id
                });
                page.build(data);
                Job.addPage(page);

                page.poll();
            }
        });
    }
});
