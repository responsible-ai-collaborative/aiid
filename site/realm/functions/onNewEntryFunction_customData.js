exports = function (changeEvent) {
    context.functions.execute('setCreatedAtField', { changeEvent, dbName: "customData" });
};