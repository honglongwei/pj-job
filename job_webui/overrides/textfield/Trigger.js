Ext.define("Job.overrides.textfield.Trigger", {
    override: "Ext.form.trigger.Trigger",

    onClick: function() {
        var me = this,
            args = arguments,
            e = me.clickRepeater ? args[1] : args[0],
            handler = me.handler,
            field = me.field;

        if (handler){
            Ext.callback(me.handler, me.scope, [field, me, e], 0, field);
        }
    }
});