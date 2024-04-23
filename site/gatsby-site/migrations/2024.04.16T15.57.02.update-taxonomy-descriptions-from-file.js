const config = require('../config');
const fs = require('fs');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  const taxa = await taxaCollection.find({}).toArray();

  const taxaNames = taxa.map(taxonomy => taxonomy.namespace);

  const descriptionsDir = './taxa/descriptions/';

  await fs.readdir(descriptionsDir, async (err, files) => {
    await files.forEach(async file => {
      const taxonomy = taxa.find(taxonomy => file == taxonomy.namespace.toLowerCase() + '.md')
      if (taxonomy) {
        await fs.readFile(descriptionsDir + '/' + file, 'utf8', async (err, data) => {
          if (err) {
            console.log(err);
          }
          console.log('Updating description for', taxonomy.namespace);
          
          await taxaCollection.updateOne(
            { namespace: taxonomy.namespace },
            { $set: { description: 'borp horp' } } 
          );

          console.log('Updated description for', taxonomy.namespace);
        });
      }
    });
  });
}

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async params => {};
