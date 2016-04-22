Ext.define("Job.view.navigation.common.aceeditor.Panel", {
    extend: "Ext.container.Container",

    mixins: {
        editor: "Job.view.navigation.common.aceeditor.Editor"
    },
    xtype: "aceeditor",
    layout: "fit",
    autofocus: true,
    
    listeners: {
        resize: function(){
            if(this.editor){
                this.editor.resize();
            }
        },
        activate: function(){
            if(this.editor && this.autofocus){
                this.editor.focus();
            }
        }
    },
    
    initComponent: function(){
        var me = this;
        var items = {
                xtype: "component",
                margin: "0 0 0 0",
                autoEl: "pre"
            };

        Ext.apply(me, {
            items: items
        });
        
        me.callParent(arguments);
    },
    
    onRender: function(){
        var me = this;

        if(me.sourceEl != null){
            me.sourceCode = Ext.get(me.sourceEl).dom.outerText; 
        }
        
        me.editorId = me.items.keys[0];
        me.oldSourceCode = me.sourceCode;
        
        me.callParent(arguments);

        me.on("afterlayout", function(){
            if(me.url){
                Ext.Ajax.request({
                    url: me.url,
                    success: function(response){
                        me.sourceCode = response.responseText;
                        me.initEditor();
                    }
                });
            }else{
                me.initEditor();
            }
        }, me, {
            single: true
        });
    }
});
