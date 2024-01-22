exports = async function (changeEvent) {
    context.functions.execute('setCreatedAtField', { changeEvent, serviceName: "mongodb-atlas", dbName: "translations" });
};