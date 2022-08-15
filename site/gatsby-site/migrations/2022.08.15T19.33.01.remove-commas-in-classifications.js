/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const classificationsCollection = client.db('aiidprod').collection('classifications');

  const classifications = await classificationsCollection.find({});

  while (await classifications.hasNext()) {
    const classification = await classifications.next();

    for (const category of Object.keys(classification.classifications).filter(
      (category) =>
        ![
          'Full Description',
          'Short Description',
          'AI System Description',
          'Location',
          'Sector of Deployment',
          'notes',
        ].includes(category)
    )) {
      const value = classification.classifications[category];

      if (Array.isArray(value)) {
        for (let string of value) {
          if (string.includes('The Equal Credit Opportunity Act')) {
            continue;
          }
          if (string.includes(',')) {
            const updatedClassifications = {};

            updatedClassifications[category] = string.split(',').map((s) => s.trim());
            await classificationsCollection.updateOne(
              { incident_id: classification.incident_id },
              { $set: { classifications: updatedClassifications } }
            );
          }
        }
      }
    }
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
