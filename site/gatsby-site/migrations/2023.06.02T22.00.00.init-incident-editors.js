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

  const incidentsCollection = client.db(config.realm.production_db.db_name).collection('incidents');

  const incidents = incidentsCollection.find({});

  for await (const incident of incidents) {
    const editors = incident.editors.map((editor) => {
      const account = accounts.find((account) => account.name === editor);

      return account ? account.userId : editor;
    });

    const updateResult = await incidentsCollection.updateOne(
      { _id: incident._id },
      { $set: { editors } }
    );

    console.log(`${incident.incident_id}, ${editors}, ${updateResult.modifiedCount}`);
  }
};
