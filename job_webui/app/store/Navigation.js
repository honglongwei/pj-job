Ext.define("Job.store.Navigation", {
    extend: "Ext.data.TreeStore",

    storeId: "Job.store.Navigation",
    root: {
        expanded: true,
        children: [{
            text:   "首页",
            view:   "Job.view.navigation.dashboard.Dashboard",
            leaf:   true,
            iconCls: "x-fa fa-home"
        },{
            text: "任务执行",
            expanded: false,
            selectable: false,
            iconCls: "x-fa fa-tasks",
            children: [{
                text: "脚本执行",
                view: "Job.view.navigation.task.runscript.Runscript",
                leaf: true,
                iconCls: "x-fa fa-file-code-o"
            },{
                text: "常用流程",
                view: "Job.view.navigation.task.manage.Manage",
                leaf: true,
                iconCls: "x-fa fa-list-ol"
            },{
                text: "新建流程",
                view: "Job.view.navigation.task.newprocedure.Newprocedure",
                leaf: true,
                iconCls: "x-fa fa-plus"
            }]
        },{
            text: "系统管理",
            expanded: false,
            selectable: false,
            iconCls: "x-fa fa-cog",
            children: [{
                text: "账户管理",
                view: "Job.view.navigation.manage.user.User",
                leaf: true,
                iconCls: "x-fa fa-user"
            },{
                text: "脚本管理",
                view: "Job.view.navigation.manage.script.Script",
                leaf: true,
                iconCls: "x-fa fa-file-code-o"
            }]
        },{
            text: "操作记录",
            expanded: false,
            selectable: false,
            iconCls: "x-fa fa-book",
            children: [{
                text: "执行历史",
                view: "Job.view.navigation.history.History",
                leaf: true,
                iconCls: "x-fa fa-history"
            }]
        }]
    }
});
