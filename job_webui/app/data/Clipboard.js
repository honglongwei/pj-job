Ext.define("Job.data.Clipboard", {
	singleton: true,

	data: null,

	set: function(data){
		var num = data.length;
		if(num == 0){
			Job.notify("info", "嘛也没复制到");
			return;
		}else{
			Job.notify("info", "复制了" + num + "台服务器");
		}

		this.data = data;
	},

	get: function(){
		if(Ext.isArray(this.data)){
			var num = this.data.length;
			if(num > 0){
				Job.notify("info", "粘贴了" + num + "台服务器");
				return this.data;
			}
		}
		
		Job.notify("info", "请先复制服务器");
	}
});