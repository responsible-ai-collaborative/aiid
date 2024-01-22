exports = async function ({ changeEvent, serviceName, dbName }) {
    const newDocument = changeEvent.fullDocument;
    const collectionName = changeEvent.ns.coll; // Get collection name from the event
    newDocument.created_at = new Date();
    const collection = context.services.get(serviceName).db(dbName).collection(collectionName);
    collection.updateOne({ _id: newDocument._id }, { $set: { created_at: newDocument.created_at } });
};