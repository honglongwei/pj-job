Ext.define("Job.view.navigation.common.status.step.StepController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.navigation.common.status.step.StepController",

    requires: [
        "Job.view.navigation.common.status.node.Node"
    ],

    node_action: function(object, msg, uri, node_status, task_status){
        var record = object.up().getWidgetRecord();
        var creater = this.getView().creater;

        var project_id = Job.getProjectId(false);
        var task_id = this.getSession().task_id;
        var step_id = this.getView().step_id;
        var node_id = record.get("id");

        Job.ask({
            msg: msg,
            yes_handler: function(){
                Ext.Ajax.request({
                    url: uri,
                    params: {
                        "project_id": project_id,
                        "task_id": task_id,
                        "step_id": step_id,
                        "node_id": node_id
                    },
                    callback_complete: function(result){
                        var viewmodel = creater.getViewModel();
                        record.set("status", node_status);
                        viewmodel.set("status", task_status);
        
                        creater.poll();
                    }
                });
            }
        });
    },

    ignore: function(object){
        var msg = "确认忽略?";
        var uri = "/history/ignore.action";
        this.node_action(object, msg, uri, 3, 0);
    },

    retry: function(object){
        var msg = "确认重试?";
        var uri = "/history/retry.action";
        this.node_action(object, msg, uri, 0, 0);
    },

    look: function(object){
        var record = object.up().getWidgetRecord();
        var node_id = record.get("id");
        var project_id = Job.getProjectId(false);

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
            }
        });
    }
});