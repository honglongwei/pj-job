Ext.define("Job.view.navigation.dashboard.info.Info", {
    extend: "Ext.panel.Panel",
    requires: [
        "Job.view.navigation.dashboard.info.*",
        "Job.view.navigation.dashboard.info.InfoModel"
    ],

    viewModel: "Job.view.navigation.dashboard.info.InfoModel",

    xtype: "xtype_info",
    title: "业务概况",
    layout: "responsivecolumn",
    bodyPadding: 40,

    defaults: {
        responsiveCls: "big-33 small-50"
    },

    items: [{
        xtype: "xtype_widget",
        containerColor: "cornflower-blue",
        bind_str: "<h2>{servers}</h2>",
        info_icon: "server",
        info_type: "业务主机数"
    },{
        xtype: "xtype_widget",
        containerColor: "green",
        bind_str: "<h2>{procedures}</h2>",
        info_icon: "list-ol",
        info_type: "常用流程数"
    },{
        xtype: "xtype_widget",
        containerColor: "magenta",
        bind_str: "<h2>{status.total}</h2></br>执行中:&nbsp;{status.runing}</br>成功:&nbsp;{status.success}</br>失败:&nbsp;{status.fail}",
        info_icon: "calendar",
        info_type: "本周任务概况"
    }],

    setData: function(data){
        var viewmodel = this.getViewModel();
        viewmodel.setData(data);
    }
});
