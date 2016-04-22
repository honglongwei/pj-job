Ext.define("Job.view.navigation.common.manage.Manage", {
    extend: "Ext.container.Container",

    listeners: {
        afterrender: "get_data",
        project_changed: "project_changed"
    },

    bodyPadding: 40,
    referenceHolder: true,
    layout: "responsivecolumn"
});