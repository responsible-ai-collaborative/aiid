const { isArray } = require('lodash');

const config = require('../config');

const accounts = [
  {
    name: 'Sean McGregor',
    userId: '619b47ea5eed5334edfa3bbc',
  },
  {
    name: 'Khoa Lam',
    userId: '62970eca16e5e43939c226f7',
  },
  {
    name: 'Daniel Atherton',
    userId: '642188372947d07020c1319d',
  },
  {
    name: 'Daniel Atherton (BNH.ai)',
    userId: '642188372947d07020c1319d',
  },
  {
    name: 'Kate Perkins',
    userId: '631be2c6052818be886417ab',
  },
  {
    name: 'Janet Schwartz',
    userId: '633c7c842af518959bfd4b13',
  },
];

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  async function updateCollection({ name, field }) {
    const collection = client.db(config.realm.production_db.db_name).collection(name);

    const items = collection.find({});

    for await (const item of items) {
      const editors = isArray(item[field])
        ? item[field].map((editor) => {
            const account = accounts.find((account) => account.name === editor);

            return account ? account.userId : editor;
          })
        : [];

      const updateResult = await collection.updateOne(
        { _id: item._id },
        { $set: { [field]: editors } }
      );

      console.log(`${name} : ${item._id}, ${editors}, ${updateResult.modifiedCount}`);
    }
  }

  await updateCollection({ name: 'incidents', field: 'editors' });

  await updateCollection({ name: 'submissions', field: 'incident_editors' });
};
