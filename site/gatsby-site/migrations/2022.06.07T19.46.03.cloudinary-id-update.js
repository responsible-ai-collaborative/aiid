const getCloudinaryPublicID = (url) => {
  // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files
  const publicID = `reports/${url.replace(/^https?:\/\//, '')}`;

  return publicID;
};

const updateCollection = async (collection) => {
  let batch = [];

  const batchSize = 10;

  const cursor = await collection.find(
    { cloudinary_id: { $exists: false } },
    { projection: { image_url: 1, _id: 1 } }
  );

  while (await cursor.hasNext()) {
    const document = await cursor.next();

    const cloudinary_id = getCloudinaryPublicID(document.image_url);

    const update = {
      updateOne: {
        filter: { _id: document._id },
        update: { $set: { cloudinary_id } },
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

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const reportsCollection = client.db('aiidprod').collection('reports');

  const submissionsCollection = client.db('aiidprod').collection('submissions');

  await Promise.all([updateCollection(reportsCollection), updateCollection(submissionsCollection)]);
};
