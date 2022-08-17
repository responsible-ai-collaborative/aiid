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

    if (classification.incident_id == 76) {
      const newDataInputs = [
        'photo IDs, names birthdays, and national IDs of people suspected of crimes',
        'camera feed',
      ];

      console.log(
        '#' + classification.incident_id,
        'Data Inputs :',
        classification.classifications['Data Inputs'],
        '→',
        newDataInputs
      );

      classificationsCollection.updateOne(
        { incident_id: 76 },
        {
          $set: {
            classifications: {
              ...classification.classifications,
              'Data Inputs': newDataInputs,
            },
          },
        }
      );
      continue;
    }

    const updatedClassifications = {};

    for (const category of Object.keys(classification.classifications).filter((category) =>
      [
        'AI Applications',
        'AI Techniques',
        'Data Inputs',
        'Harm Distribution Basis',
        'Laws Implicated',
        'Named Entities',
      ].includes(category)
    )) {
      const value = classification.classifications[category];

      if (Array.isArray(value) && value.length == 1) {
        const string = value[0];

        if (
          string.includes('The Equal Credit Opportunity Act') ||
          string.includes('user content (textposts, images, videos)')
        ) {
          continue;
        }

        const semicolon = string.includes(';');

        const comma = string.includes(',');

        if (semicolon || comma) {
          const newValue = string.split(semicolon ? ';' : ',').map((s) => s.trim());

          updatedClassifications[category] = newValue;

          console.log(
            '#' + classification.incident_id,
            category,
            ':',
            classification.classifications[category],
            '→',
            newValue
          );
        }
      }
    }

    await classificationsCollection.updateOne(
      { incident_id: classification.incident_id },
      {
        $set: {
          classifications: {
            ...classification.classifications,
            ...updatedClassifications,
          },
        },
      }
    );
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
