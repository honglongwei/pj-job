Ext.define("Job.view.navigation.task.common.procedure.ProcedureController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.task.common.procedure.ProcedureController",

    requires: [
        "Job.view.navigation.task.common.scriptstep.Scriptstep"
    ],

    setup: function(){
        var store = Ext.getStore("Job.store.User");
        store.load();
    },

    get_data: function(){
        var procedure_name = null;

        var name_ob = this.lookupReference("ref_textfield_name");
        if (!name_ob.isValid()){
            Job.notify("info", "请先填写流程名");
            return;
        }
        procedure_name = name_ob.getValue();

        var procedure_obj = {};
        procedure_obj.name = procedure_name;
        procedure_obj.steps = [];

        var procedure_list = this.lookupReference("ref_container_list");
        var steps = procedure_list.items.items;

        for(var i in steps){
            var step = steps[i];

            var step_obj = {};
            var stepname = step.getName();
            if(!stepname){
                Job.notify("info", "请先填写步骤名");
                return;
            }

            step_obj.name = stepname;
            step_obj.type = step.getType();
            step_obj.nodes = [];

            var store = step.getStore();
            var records = store.getRange();
            for(var i in records){
                var record = records[i];

                var validation = record.getValidation();
                if(!validation.isValid()){
                    record.set("valid", false);
                    var data = validation.getData();

                    for(var key in data){
                        var value = data[key]
                        if(value != true){
                            Job.notify("warning", value);
                            return;
                        }
                    }
                    return;
                }else{
                    record.set("valid", true);
                }
                var node_obj = {};

                var name = record.get("name");
                var user = record.get("user");
                var args = record.get("args");
                var content = record.get("content");
                var type = record.get("type");
                var servers = [];
                record.getServerStore().each(function(rec){
                    servers.push(rec.get("host"));
                });

                node_obj.name = name;
                node_obj.user = user;
                node_obj.args = args;
                node_obj.content = content;
                node_obj.type = type;
                node_obj.servers = servers;

                step_obj.nodes.push(node_obj);
            };

            procedure_obj.steps.push(step_obj);
        };

        return procedure_obj;
    },

    save: function(object){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        
        var procedure_obj = this.get_data();

        if(!procedure_obj){
            return;
        }

        Ext.Ajax.request({
            url: "/task/procedure/add.action",
            params: {
                "project_id": project_id,
                "procedure": JSON.stringify(procedure_obj)
            }
        });
    },

    run: function(){
        var project_id = Job.getProjectId(true);
        if(project_id == null){
            return;
        }
        
        var procedure_obj = this.get_data();

        if(!procedure_obj){
            return;
        }

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
            callback_complete: function(result){
                var task = result["data"];
                var page = Ext.create("Job.view.navigation.common.status.task.Task", {
                    session: {
                        task_id: task_id
                    }
                });
                page.build(task);
                Job.addPage(page);

                page.poll();
            }
        });
    },

    add_scriptstep: function(){
        this.getView().addScriptstep(true);
    }
});
