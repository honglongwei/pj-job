Ext.define("Job.view.Viewport", {
    extend: "Ext.container.Viewport",

    requires: [
        "Ext.layout.container.Border",
        "Ext.list.Tree",
        "Job.view.header.user.User",
        "Job.view.header.project.Project",
        "Job.view.ViewportController",
        "Job.view.ViewportModel"
    ],

    controller: "Job.view.ViewportController",
    viewModel: "Job.view.ViewportModel",

    listeners: {
        afterrender: "open_dashboard"
    },

    referenceHolder: true,
    layout: {
        type: "border"
    },

    initComponent: function(){
        var me = this;

        var mask = Ext.create("Ext.LoadMask", {
            msg: "请等待",
            frame: false,
            cls: "",
            target: me
        });

        Job.lock = function(){
            mask.el.dom.style.zIndex = 99999;
            mask.show();
        };

        Job.unlock = function(){
            mask.hide();
        };

        Job.getViewport = function(){
            return me;
        };

        Job.changeNavigation = function(view){
            var navigation = me.lookupReference("ref_treelist_navigation");
            var store = navigation.getStore();
            var node = store.findNode("view", view);
            navigation.setSelection(node);
        };

        Job.resetNavigation = function(){
            var navigation = me.lookupReference("ref_treelist_navigation");
            var node = navigation.getSelection();
            navigation.fireEventArgs("selectionchange", [navigation, node]);
        };

        Job.addPage = function(object){
            var data = me.getViewModel().getData();
            var main = me.lookupReference("ref_container_main");
            main.add(object);
            main.showPage(object);
            data.current_view = object;
        };

        Job.backPage = function(object){
            var main = me.lookupReference("ref_container_main");
            var back = null;
            main.items.each(function(item, index){
                if(object == item){
                    if(index != 0){
                        back = main.items.items[index - 1];
                    }
                    return false;
                }
            });
            if(back){
                main.showPage(back);
                object.destroy();
            }
        };

        this.callParent();
    },

    items: [{
        xtype: "toolbar",
        cls: "sencha-dash-dash-headerbar toolbar-btn-shadow",
        region: "north",
        height: 64,

        items: [{
            xtype: "component",
            reference: "senchaLogo",
            cls: "sencha-logo",
            html: "<div class='main-logo'><img src='resources/images/sencha-icon.png'>任务平台</div>",
            width: 250
        },{
            xtype: "xtype_project"
        },{
            xtype: "tbspacer",
            flex: 1
        },{
            xtype: "xtype_user"
        }]
    },{
        xtype: "treelist",
        reference: "ref_treelist_navigation",
        region: "west",
        ui: "navigation",
        store: "Job.store.Navigation",
        width: 250,
        expanderFirst: false,
        expanderOnly: false,
        listeners: {
            selectionchange: "select_change"
        }
    },{
        xtype: "container",
        region: "center",
        autoScroll: true,
        reference: "ref_container_main",
        cls: "sencha-dash-right-main-container",
        layout: "card",

        showPage: function(object){
            var me = this;
            var l = me.getLayout();
            l.setActiveItem(object);
        }
    }]
});