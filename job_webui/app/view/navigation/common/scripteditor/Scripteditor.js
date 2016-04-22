Ext.define("Job.view.navigation.common.scripteditor.Scripteditor", {
    extend: "Ext.container.Container",

    requires: [
        "Job.view.common.scripteditor.ScripteditorController",
        "Job.view.navigation.common.aceeditor.Panel"
    ],

    controller: "Job.view.common.scripteditor.ScripteditorController",

    readOnly: false,
    sourceDisabled: false,
    xtype: "scripteditor",
    referenceHolder: true,

    initComponent: function(){
        var me = this;
        var readOnly = me.readOnly;
        var sourceDisabled = me.sourceDisabled;

        var source = null;
        if(!sourceDisabled){
            source = Ext.create("Ext.form.RadioGroup", {
                fieldLabel: "脚本来源",
                reference: "ref_radiogroup_source",
                margin: "8 0 0 0",
                disabled: readOnly,
                labelWidth: 80,
                defaults: {
                    name: "source"
                },
        
                listeners: {
                    change: "change_source"
                },
        
                items: [{
                    inputValue: "manual",
                    boxLabel: "手工录入",
                    checked: true,
                    width: 100
                }, {
                    inputValue: "clone",
                    boxLabel: "脚本克隆"
                }]
            });
        }

        me.items = [source,{
            xtype: "panel",
            frame: true,
            margin: "8 0 0 85",
            width: 715,
            hidden: true,
            reference: "ref_panel_clone",
    
            items: [{
                xtype: "combobox",
                fieldLabel: "脚本名称",
                margin: "10 0 10 30",
                displayField: "name",
                valueField: "id",
                emptyText: "请选择脚本",
                store: "Job.store.Script",
                labelWidth: 60,
                allowBlank: false,
                editable: false,
                queryMode: "local",
                width: 500,
                listeners: {
                    select: "select_change"
                }
            }]
        },{
            xtype: "container",
            width: 800,
            margin: "10 0 0 0",
    
            layout: {
                type: "hbox",
                pack: "start",
                align: "stretch"
            },
    
            items: [{
                html: "脚本内容:",
                width: 85,
                margin: "8 0 0 0"
            },{
                xtype: "panel",
                width: 715,
                height: 400,
                frame: true,
                layout: "fit",

                header: {
                    style: "background-color: #FFFFFF;",
                    padding: 6,
                    titlePosition: 1,
                    items: [{
                        xtype: "segmentedbutton",
                        reference: "ref_segmentedbutton_type",
                        defaults: {
                            width: 60,
                            hidden: readOnly
                        },
                        listeners: {
                            toggle: "change_type"
                        },
                        items: [{
                            text: "bash",
                            reference: "ref_button_bash",
                            value: 1,
                            pressed: true
                        },{
                            xtype: "tbspacer",
                            width: 5
                        },{
                            text: "bat",
                            reference: "ref_button_bat",
                            value: 2
                        },{
                            xtype: "tbspacer",
                            width: 5
                        },{
                            text: "python",
                            reference: "ref_button_python",
                            value: 3
                        }]
                    }]
                },
    
                items: [{
                    xtype: "aceeditor",
                    reference: "ref_aceeditor",
                    flex: 1,
                    readOnly: readOnly,
                    theme: "ambiance",
                    printMargin: true,
                    fontSize: "13px",
                    listeners: {
                        editorcreated: "setup"
                    }
                }]
            }]
        }];

        me.callParent();
    },

    isClone: function(){
        var source = this.lookupReference("ref_radiogroup_source");
        var value = source.getValue();
        if(value.source == "clone"){
            return true;
        }else{
            return false;
        }
    },

    isManual: function(){
        return !this.isClone();
    },

    getContent: function(){
        var editor = this.lookupReference("ref_aceeditor");
        return editor.getValue();
    },

    setContent: function(content){
        var editor = this.lookupReference("ref_aceeditor");
        editor.setValue(content);
    },

    getType: function(){
        var segmentedbutton = this.lookupReference("ref_segmentedbutton_type");
        return segmentedbutton.value;
    },

    setType: function(type){
        var segmentedbutton = this.lookupReference("ref_segmentedbutton_type");
        var button = null;
        switch(type){
            case 1:
                button = this.lookupReference("ref_button_bash");
                button.setPressed();
                break;

            case 2:
                button = this.lookupReference("ref_button_bat");
                button.setPressed();
                break;

            case 3:
                button = this.lookupReference("ref_button_python");
                button.setPressed();
                break;

            default:
                break;
        }

        if(this.readOnly){
            button.setHidden(false);
        }
    }
});
