Ext.define("Job.model.Scriptnode", {
    extend: "Ext.data.Model",

    requires: [
        "Ext.data.validator.Presence",
        "Ext.data.validator.Length",
        "Ext.data.validator.Inclusion",
        "Ext.data.validator.Range"
    ],

    fields: [
        {name: "name", type: "string", validators: [{
            type: "presence",
            message: "请先填写脚本名"
        },{
            type: "length", 
            max: 200, 
            maxOnlyMessage: "脚本名不得超过{0}个字符"
        }]},
        {name: "user", type: "int", defaultValue: null, validators: {
            type: "presence", 
            message: "还没有配置执行用户"
        }},
        {name: "num_str", type: "string", depends: ["num"], convert: function(v, rec){
            var num = rec.get("num");
            if(num){
                return "共" + num + "台";
            }else{
                return "还没选择服务器";
            }
        }},
        {name: "num", type: "int", defaultValue: 0, validators: {
            type: "range",
            min: 1,
            minOnlyMessage: "还没有添加服务器"
        }},
        {name: "args", type: "string"},
        {name: "content", type: "string", validators: {
            type: "presence",
            message: "请先编写脚本"
        }},
        {name: "type", type: "int", validators: {type: "inclusion", list: [1, 2, 3]}},
        {name: "valid", type: "boolean", defaultValue: true}
    ]
});