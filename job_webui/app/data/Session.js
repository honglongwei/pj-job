Ext.define("Job.data.Session", {
	singleton: true,

	username: "",
    project: [],

	setName: function(username){
		this.username = username;
	},

	getName: function(){
		return this.username;
	},

    setProject: function(project){
        this.project = project;
    },

    getProject: function(){
        return this.project;
    }
});