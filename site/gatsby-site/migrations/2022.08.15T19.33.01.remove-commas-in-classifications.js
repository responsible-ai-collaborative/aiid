/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  await client.connect();

  const classificationsCollection = client.db('aiidprod').collection('classifications');

  const classifications = await classificationsCollection.find({});

  while (await classifications.hasNext()) {
    const classification = await classifications.next();

    if (classification.incident_id == 40) {
      continue;
    }

    for (const category of Object.keys(classification.classifications).filter(
      (category) =>
        ![
          'Full Description',
          'Short Description',
          'AI System Description',
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
  classificationsCollection.updateOne(
    { incident_id: 76 },
    {
      $set: {
        classifications: {
          'Data Inputs': [
            'photo IDs, names birthdays, and national IDs of people suspected of crimes',
            'camera feed',
          ],
        },
      },
    }
  );
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
