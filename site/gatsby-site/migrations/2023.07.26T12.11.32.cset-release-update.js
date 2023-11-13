const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxaCollection.updateOne(
    { namespace: 'CSETv0' },
    {
      $set: {
        description: handleWhitespace(`
  # What is the CSET Taxonomy?

  The CSET AI Harm Taxonomy for AIID is the second edition of the 
  CSET incident taxonomy. It characterizes the harms, entities and 
  technologies involved in AI incidents and the circumstances of 
  their occurrence. Every incident is independently classified by 
  two CSET annotators. Annotations are peer reviewed and finally 
  randomly selected for quality control ahead of publication. 
  Despite this rigorous process, mistakes do happen, and readers 
  are invited to report any errors they might discover while 
  browsing.
`),
      },
    }
  );
  await taxaCollection.updateOne(
    { namespace: 'CSETv1' },
    {
      $set: {
        description: handleWhitespace(`
# What is the CSET Taxonomy?

The CSET AI Harm Taxonomy for AIID is the second edition of the 
CSET incident taxonomy. It characterizes the harms, entities and 
technologies involved in AI incidents and the circumstances of 
their occurrence. Every incident is independently classified by 
two CSET annotators. Annotations are peer reviewed and finally 
randomly selected for quality control ahead of publication. 
Despite this rigorous process, mistakes do happen, and readers 
are invited to report any errors they might discover while 
browsing. The first version of the CSET taxonomy is available [here](/taxonomy/csetv0/).
`),
      },
    }
  );
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};

var handleWhitespace = (string) =>
  string
    .trim()
    .split('\n')
    .map((line) => line.replace(/ */, ''))
    .join('\n');
