const getSourceDomain = (report) => {
  try {
    const url = new URL(report.url);

    return url.hostname;
  } catch (e) {
    return '';
  }
};

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const collection = client.db('aiidprod').collection('submissions');

  const cursor = await collection.find(
    { source_domain: { $exists: false } },
    { projection: { url: 1, _id: 1 } }
  );

  let batch = [];

  const batchSize = 10;

  while (await cursor.hasNext()) {
    const item = await cursor.next();

    const source_domain = getSourceDomain(item);

    const update = {
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { source_domain } },
      },
    };

    batch.push(update);

    console.log(`Update ${JSON.stringify(update)}`);

    if (batch.length == batchSize || !(await cursor.hasNext())) {
      await collection.bulkWrite(batch);

      batch = [];
    }
  }
};
