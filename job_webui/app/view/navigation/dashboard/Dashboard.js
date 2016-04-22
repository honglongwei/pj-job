Ext.define("Job.view.navigation.dashboard.Dashboard", {
    extend: "Ext.container.Container",

    requires: [
        "Job.view.navigation.dashboard.info.Info",
        "Job.view.navigation.dashboard.TaskList",
        "Job.view.navigation.dashboard.DashboardModel",
        "Job.view.navigation.dashboard.DashboardController",
        "Ext.ux.layout.ResponsiveColumn"
    ],

    viewModel: "Job.view.navigation.dashboard.DashboardModel",
    controller: "Job.view.navigation.dashboard.DashboardController",

    listeners: {
        afterrender: "get_data",
        project_changed: "project_changed"
    },
    
    layout: "responsivecolumn",

    items: [{
        xtype: "xtype_info",
        reference: "ref_info",
        cls: "shadow-panel"
    },{
        xtype: "xtype_taskList",
        reference: "ref_tasklist",
        responsiveCls: "big-50 small-100"
    }]
});
