Ext.define("Job.view.navigation.dashboard.info.Widget", {
    extend: "Ext.panel.Panel",
    xtype: "xtype_widget",

    cls: "admin-widget-small sale-panel info-card-item shadow-panel",
    containerColor: "",
    height: 170,
    layout: {
        type: "hbox",
        pack: "start",
        align: "stretch"
    },

    defaults: {
        xtype: "container",
        padding: "30 0 0 20"
    },

    initComponent: function(){
        var me = this;

        me.items = [{
            flex: 2,
            bind: {
                html: me.bind_str
            }
        },{
            flex: 1,
            layout: {
                type: "vbox",
                pack: "start",
                align: "stretch"
            },
            defaults: {
                flex: 1
            },

            items: [{
                margin: "0 0 0 18",
                html: "<span class='x-fa fa-" + me.info_icon + "'></span>"
            },{
                html: me.info_type
            }]
        }];

        Ext.apply(me, {
            cls: me.config.containerColor
        });

        me.callParent(arguments);
    }
});
