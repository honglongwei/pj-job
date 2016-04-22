Ext.define("Job.view.navigation.task.common.ux.UserCombobox", {
    extend: "Ext.form.field.Picker",

    requires: [
        "Ext.view.BoundList"
    ],

    xtype: "xtype_usercombobox",
    matchFieldWidth: true,

    createPicker: function(){
        var me = this;

        var textfieldCfg = Ext.apply({
            xtype: "textfield",
            reference: "ref_textfield_value",
            flex: 1
        }, me.valueConfig);

        var boundlistCfg = Ext.apply({
            xtype: "boundlist",
            pickerField: me,
            store: me.store,
            displayField: me.displayField,
            border: false,

            listeners: {
                selectionchange: function(object, selected){
                    var record = selected[0];
                    var displayField = me.displayField;
                    var valueField = me.valueField;

                    me.setValue(record.get(valueField));
                    me.setRawValue(record.get(displayField));
                    me.collapse();
                    me.fireEventArgs("select", [me, record]);
                }
            }
        }, me.listConfig);

        var picker = Ext.create("Ext.panel.Panel", {
            floating: true,
            hidden: true,
            focusOnToFront: false,
            style: "border-color: #d0d0d0; border-width: 1px; border-style: solid;",
            referenceHolder: true,

            items: [{
                xtype: "container",
                padding: 5,

                layout: {
                    type: "hbox",
                    pack: "start",
                    align: "middle"
                },
    
                items: [textfieldCfg, {
                    xtype: "button",
                    margin: "0 0 0 5",
                    iconCls: "x-fa fa-plus",
                    handler: function(){
                        var textfield = me.picker.lookupReference("ref_textfield_value");
                        me.fireEvent("add_value", textfield);
                    }
                }]
            },boundlistCfg]
        });

        me.picker = picker;
        return picker;
    },

    setValue: function(value){
        var me = this;
        me.callParent([value]);

        if(value){
            var store = Ext.getStore(me.store);
            var record = store.getById(value);
            if(record){
                me.setRawValue(record.get(me.displayField));
            }
        }
    }
});