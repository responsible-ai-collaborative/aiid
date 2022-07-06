const remark = require('remark');

const remarkStrip = require('strip-markdown');

async function stripMarkdown(markdown) {
  const result = await remark().use(remarkStrip).process(markdown);

  return result.contents.toString();
}

/**
 *
 * @param {import('mongodb').Collection} collection
 */

const formatCollection = async (collection) => {
  const cursor = await collection.find(
    { plain_text: { $exists: false } },
    { projection: { _id: 1, text: 1 } }
  );

  let batch = [];

  const batchSize = 10;

  while (await cursor.hasNext()) {
    const item = await cursor.next();

    const plain_text = await stripMarkdown(item.text);

    const update = {
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { plain_text } },
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
