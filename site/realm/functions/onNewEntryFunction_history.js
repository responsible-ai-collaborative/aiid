exports = function (changeEvent) {
    context.functions.execute('setCreatedAtField', { changeEvent, serviceName: "mongodb-atlas", dbName: "history" });
};