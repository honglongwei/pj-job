Ext.define("Job.model.Server", {
    extend: "Ext.data.Model",
    fields: ["id", "host", "zone", "channel", "function", "desc", "status", {
        name: "scriptnode_id", reference: {
            type: "Job.model.Scriptnode",
            inverse: "getServerStore"
        }
    }]
});