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

  const usersCollection = client.db(config.realm.production_db.db_custom_data).collection('users');

  const users = await usersCollection.find({
    userId: { $in: accounts.map((account) => account.userId) },
  }).toArray();

  for (const account of accounts) {
    const user = users.find(user => user.userId == account.userID);

    const [first_name, last_name] = account.name.split(' ');

    if (user) {

      const updateResult = await usersCollection.updateOne(
        { _id: user._id },
        { $set: { first_name, last_name } }
      );

    } else {

      const insertResult = await usersCollection.insertOne({
        userId: account.userId,
        roles: [],
        first_name,
        last_name,
      });
    }
  }
};

exports.down = async () => { }


