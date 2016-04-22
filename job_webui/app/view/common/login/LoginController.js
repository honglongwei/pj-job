Ext.define("Job.view.common.login.LoginController", {
    extend: "Ext.app.ViewController",
    alias: "controller.Job.view.common.login.LoginController",

    login: function(){
        var form = this.lookupReference("ref_form_login");
        var button = this.lookupReference("ref_button_login");
        var values = form.getValues();
        var view = this.getView();

        button.setText("登录中...");
        button.disable();
        Ext.Ajax.request({
            lock: false,
            url: "api/auth/login.action",
            params: values,
            callback_complete: function(result){
                var data = result["data"];
                var username = data["username"];
                var project = data["project"]

                Job.data.Session.setName(username);
                Job.data.Session.setProject(project);

                Job.showViewport();
                view.close();
            },
            callback_exception: function(){
                button.setText("登录");
                button.enable();
            }
        });
    }
});
