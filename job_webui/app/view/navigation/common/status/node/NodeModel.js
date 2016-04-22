Ext.define("Job.view.navigation.common.status.node.NodeModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.common.status.node.NodeModel",

    data: {
    },

    formulas: {
        getStatus: function(get){
            var status = get("status");
            switch(status){
                case 0:
                    return "<span class='font-runing'>等待执行</span>";
                    break;
                    
                case 1:
                    return "<span class='font-success'>执行成功</span>";
                    break;

                case 2:
                    return "<span class='font-fail'>执行失败</span>";
                    break;

                case 3:
                    return "<span class='font-warning'>忽略错误</span>";
                    break;

                case 10:
                    return "<span class='font-runing'>正在执行</span>";
                    break;

                default:
                    break;
            }
        },
        getType: function(get){
            var type = get("type");
            switch(type){
                case 1:
                    return "执行脚本";
                    break;

                case 2:
                    return "文件分发";
                    break;

                default:
                    break;
            }
        }
    }
});