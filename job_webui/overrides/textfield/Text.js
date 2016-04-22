Ext.define("Job.overrides.textfield.Text", {
    override: "Ext.form.field.Text",

    blankText: "必填项",
    maxLengthText: "不能超过{0}个字符",
    minLengthText: "不能少于{0}个字符",

    validator: function(value){
        var me = this;
        if(Ext.isString(value)){
            if(me.allowBlank == false){
                if(value.length == 0){
                    return true;
                }
                
                if(Ext.util.Format.trim(value).length == 0){
                    return me.blankText;
                }
            }
        }

        return true;
    }
});