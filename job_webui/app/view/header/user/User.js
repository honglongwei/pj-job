Ext.define("Job.view.header.user.User", {
	extend: "Ext.container.Container",

	xtype: "xtype_user",

	layout: {
        type: "hbox",
        pack: "start",
        align: "middle"
    },

	items: [{
        xtype: "tbtext",
        text: "konglw1",
        cls: "top-user-name",
        margin: "0 10 0 0",
        listeners: {
            afterrender: function(){
                var username = Job.data.Session.getName();
                this.setText(username);
            }
        }
    },{
        xtype: "image",
        cls: "header-right-profile-image",
        height: 35,
        width: 35,
        alt:"current user image",
        src: "resources/images/user-profile/2.png"
    }]
});