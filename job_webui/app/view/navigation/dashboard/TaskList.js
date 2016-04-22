Ext.define("Job.view.navigation.dashboard.TaskList", {
    extend: "Ext.grid.Panel",

    requires: [
        "Job.view.navigation.dashboard.TaskListController"
    ],

    controller: "Job.view.navigation.dashboard.TaskListController",
    
    xtype: "xtype_taskList",
    cls: "todo-list shadow-panel",
    title: "近期任务执行记录",
    maxHeight: 320,
    emptyText: "嘛也没有",
    trackMouseOver: false,
    disableSelection: true,
    store: "Job.store.Task",

    header: {
        padding: "6 6 6 16",
        titlePosition: 0,
        items: [{
            xtype: "button",
            text: "更多",
            handler: "more"
        }]
    },

    columns: {
        defaults: {
            sortable:false,
            menuDisabled:true,
            resizable:false,
            focusCls: ""
        },

        items: [{
            text: "执行人",
            dataIndex: "user",
            flex: 2
        },{
            text: "耗时",
            dataIndex: "total_time",
            flex: 1,
            minWidth: 60
        },{
            text: "状态",
            dataIndex: "status",
            flex: 1,
            minWidth: 90,

            renderer: function(value){
                switch(value){
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
        },{
            text: "任务名",
            dataIndex: "name",
            flex: 3
        }]
    },

    setData: function(data){
        var store = Ext.getStore("Job.store.Task");
        store.setData(data);
    }
});
