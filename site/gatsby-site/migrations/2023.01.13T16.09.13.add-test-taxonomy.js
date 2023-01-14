const config = require('../config');

exports.up = async ({ context: { client } }) => {
  const taxa = client.db(config.realm.production_db.db_name).collection('taxa');

  const taxonomy = {
    namespace: 'TestTaxonomy',
    weight: 50,
    description: 'A taxonomy that only exists to test the related features',
    field_list: [
      {
        short_name: 'element',
        long_name: 'Classical Element',
        short_description: 'Which classical element is this incident most associated with?',
        long_description:
          'Which classical element (fire, water, earth, air) is this incident associated with?',
        display_type: 'enum',
        mongo_type: 'string',
        default: '',
        placeholder: 'Element',
        permitted_values: ['fire', 'water', 'earth', 'air'],
        weight: 50,
        instant_facet: false,
        required: false,
        public: true,
      },
      {
        short_name: 'keywords',
        long_name: 'Keywords',
        short_description: 'What are the keywords for this incident?',
        long_description: 'What are the keywords for this incident?',
        display_type: 'list',
        mongo_type: 'array',
        default: '',
        placeholder: 'keywords',
        weight: 50,
        instant_facet: false,
        required: false,
        public: true,
      },
      {
        short_name: 'interesting',
        long_name: 'Interesting',
        short_description: 'Is this incident interesting?',
        long_description: 'Is this incident interesting?',
        display_type: 'bool',
        mongo_type: 'bool',
        default: '',
        placeholder: 'Interesting',
        weight: 50,
        instant_facet: false,
        required: false,
        public: true,
      },
    ],
  };

  await taxa.insertOne(taxonomy);

  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const classification = {
    incident_id: 1,
    namespace: 'TestTaxonomy',
    notes: '',
    attributes: [
      {
        short_name: 'interesting',
        mongo_type: 'bool',
        value: { bool: true },
      },
      {
        short_name: 'element',
        mongo_type: 'string',
        value: { string: 'fire' },
      },
      {
        short_name: 'keywords',
        mongo_type: 'array',
        value: { array: ['Youtube', 'Kids'] },
      },
    ],
  };

  await classifications.insertOne(classification);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const taxa = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxa.deleteOne({ namespace: 'TestTaxonomy' });

  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  await classifications.deleteMany({ namespace: 'TestTaxonomy' });
};
