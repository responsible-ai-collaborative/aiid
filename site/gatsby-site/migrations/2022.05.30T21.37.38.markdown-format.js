/**
 *
 * @param {import('mongodb').Collection} collection
 */

const formatCollection = async (collection) => {
  const cursor = await collection.find({}, { projection: { _id: 1, text: 1 } });

  let batch = [];

  const batchSize = 10;

  while (await cursor.hasNext()) {
    const item = await cursor.next();

    // convert single newlines to markdown-compatible double newlines
    const text = item.text.replace(/(^|[^\n])\n(?!\n)/g, '$1\n\n');

    const update = {
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { text, plain_text: text } },
      },
    };

    console.log(`Updated document ${item._id}`);

    batch.push(update);

    if (batch.length == batchSize || !(await cursor.hasNext())) {
      await collection.bulkWrite(batch);

      batch = [];
    }
  }
};

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db('aiidprod').collection('reports');

  const submissionsCollection = client.db('aiidprod').collection('submissions');

  await Promise.all([formatCollection(reportsCollection), formatCollection(submissionsCollection)]);
};
