Ext.define("Job.view.navigation.common.list.List", {
    extend: "Ext.grid.Panel",

    requires: [
        "Job.view.navigation.common.list.ListController"
    ],

    controller: "Job.view.navigation.common.list.ListController",

    listeners: {
        get_data: "get_data",
        project_changed: "project_changed"
    },

    xtype: "xtype_list",
    reference: "ref_grid_list",
    referenceHolder: true,
    margin: "5 0 0 0",
    frame: true,
    columnLines: true,
    maxHeight: 400,
    emptyText: "嘛也没有",
    viewConfig: {
        loadMask: false
    },

    initComponent: function(){
        var me = this;
        var store = me.config.store;
        var bind = me.config.bind;

        me.bbar = {
            xtype: "pagingtoolbar",
            reference: "ref_pagingtoolbar",
            displayInfo: true
        };
        
        if(store){
            me.bbar.store = store;
        }else if(bind){
            me.bbar.bind = bind;
        };

        me.callParent();
    }
});