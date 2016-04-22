Ext.define("Job.view.navigation.common.status.task.TaskModel", {
    extend: "Ext.app.ViewModel",
    alias: "viewmodel.Job.view.navigation.common.status.task.TaskModel",

    data: {
        name: "版本发布",
        start_time: "2016-02-17 11:53:12",
        status: 1,
        end_time: "2016-02-17 11:54:12",
        start_user: "test",
        total_time: "2.474"
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

                case 10:
                    return "<span class='font-runing'>正在执行</span>";
                    break;

                default:
                    break;
            }
        }
    }
});