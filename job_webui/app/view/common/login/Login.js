Ext.define("Job.view.common.login.Login", {
    extend: "Ext.window.Window",

    requires: [
        "Job.view.common.login.LoginController"
    ],

    controller: "Job.view.common.login.LoginController",

    header: false,
    cls: "auth-window",
    closable: false,
    resizable: false,
    autoShow: true,
    maximized: true,
    modal: true,

    layout: {
        type: "vbox",
        align: "center",
        pack: "center"
    },

    items: [{
        xtype: "form",
        reference: "ref_form_login",
        bodyPadding: "20 20",
        cls: "auth-dialog",
        header: false,
        width: 415,
        layout: {
            type: "vbox",
            align: "stretch"
        },

        defaults : {
            margin : "5 0"
        },

        items: [{
            xtype: "label",
            text: "欢迎使用任务平台"
        },{
            xtype: "textfield",
            name: "username",
            height: 55,
            hideLabel: true,
            emptyText: "请输入用户名",
            triggers: {
                glyphed: {
                    cls: "trigger-glyph-noop auth-email-trigger"
                }
            }
        },{
            xtype: "textfield",
            height: 55,
            hideLabel: true,
            emptyText: "请输入密码",
            inputType: "password",
            name: "password",
            triggers: {
                glyphed: {
                    cls: "trigger-glyph-noop auth-password-trigger"
                }
            }
        },{
            xtype: "button",
            scale: "large",
            reference: "ref_button_login",
            ui: "soft-green",
            iconAlign: "right",
            iconCls: "x-fa fa-angle-right",
            text: "登录",
            handler: "login"
        }]
    }]
});