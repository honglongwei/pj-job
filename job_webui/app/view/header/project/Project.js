Ext.define("Job.view.header.project.Project", {
    extend: "Ext.form.field.ComboBox",

    requires: [
        "Job.view.header.project.ProjectModel",
        "Job.view.header.project.ProjectController"
    ],

    xtype: "xtype_project",
    controller: "Job.view.header.project.ProjectController",
    viewModel: "Job.view.header.project.ProjectModel",

    initComponent: function(){
        var me = this;

        //获取project_id
        Job.getProjectId = function(notify){
            if(!me.isValid()){
                if(notify){
                    Job.notify("error", "请先选择业务!");
                }
                return null;
            }
            return me.getValue();
        };

        this.callParent();
    },

    listeners:{
        afterrender: "get_data",
        select: "select"
    },

    fieldLabel: "当前业务",
    emptyText: "请选择业务",
    margin: "0 0 0 8",
    forceSelection: true,
    labelWidth: 60,
    allowBlank: false,
    editable: false,
    displayField: "name",
    valueField: "id",
    queryMode: "local",
    width: 200,
    bind: {
        store: "{store_combo_project}"
    }
});