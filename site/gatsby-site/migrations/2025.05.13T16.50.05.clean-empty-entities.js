/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  try {
    await client.connect();
    const db = client.db('aiidprod');

    const incidents = db.collection('incidents');

    const submissions = db.collection('submissions');

    const incidentsWithEmptyEntities = await incidents.find({
      $or: [
        { 'Alleged deployer of AI system': { $elemMatch: { $eq: '' } } },
        { 'Alleged developer of AI system': { $elemMatch: { $eq: '' } } },
        { 'Alleged harmed or nearly harmed parties': { $elemMatch: { $eq: '' } } },
        { implicated_systems: { $elemMatch: { $eq: '' } } },
      ],
    });

    let incidentCount = 0;

    let incidentUpdates = 0;

    for await (const incident of incidentsWithEmptyEntities) {
      incidentCount++;
      const {
        'Alleged deployer of AI system': deployers,
        'Alleged developer of AI system': developers,
        'Alleged harmed or nearly harmed parties': harmedParties,
        implicated_systems: implicatedSystems,
      } = incident;

      if (deployers.includes('')) {
        await incidents.updateOne(
          { _id: incident._id },
          { $pull: { 'Alleged deployer of AI system': '' } }
        );
        incidentUpdates++;
        console.log(`Removed empty deployer from incident ${incident.incident_id}`);
      }

      if (developers.includes('')) {
        await incidents.updateOne(
          { _id: incident._id },
          { $pull: { 'Alleged developer of AI system': '' } }
        );
        incidentUpdates++;
        console.log(`Removed empty developer from incident ${incident.incident_id}`);
      }

      if (harmedParties.includes('')) {
        await incidents.updateOne(
          { _id: incident._id },
          { $pull: { 'Alleged harmed or nearly harmed parties': '' } }
        );
        incidentUpdates++;
        console.log(`Removed empty harmed party from incident ${incident.incident_id}`);
      }

      if (implicatedSystems.includes('')) {
        await incidents.updateOne({ _id: incident._id }, { $pull: { implicated_systems: '' } });
        incidentUpdates++;
        console.log(`Removed empty implicated system from incident ${incident.incident_id}`);
      }
    }

    console.log(
      `Processed ${incidentCount} incidents with empty entities and made ${incidentUpdates} updates to incidents`
    );

    const submissionsWithEmptyEntities = await submissions.find({
      $or: [
        { deployers: { $elemMatch: { $eq: '' } } },
        { developers: { $elemMatch: { $eq: '' } } },
        { harmed_parties: { $elemMatch: { $eq: '' } } },
        { implicated_systems: { $elemMatch: { $eq: '' } } },
      ],
    });

    let submissionCount = 0;

    let submissionUpdates = 0;

    for await (const submission of submissionsWithEmptyEntities) {
      submissionCount++;
      const { deployers, developers, harmed_parties, implicated_systems } = submission;

      if (deployers.includes('')) {
        await submissions.updateOne({ _id: submission._id }, { $pull: { deployers: '' } });
        submissionUpdates++;
        console.log(`Removed empty deployer from submission ${submission._id}`);
      }

      if (developers.includes('')) {
        await submissions.updateOne({ _id: submission._id }, { $pull: { developers: '' } });
        submissionUpdates++;
        console.log(`Removed empty developer from submission ${submission._id}`);
      }

      if (harmed_parties.includes('')) {
        await submissions.updateOne({ _id: submission._id }, { $pull: { harmed_parties: '' } });
        submissionUpdates++;
        console.log(`Removed empty harmed party from submission ${submission._id}`);
      }

      if (implicated_systems.includes('')) {
        await submissions.updateOne({ _id: submission._id }, { $pull: { implicated_systems: '' } });
        submissionUpdates++;
        console.log(`Removed empty implicated system from submission ${submission._id}`);
      }
    }

    console.log(
      `Processed ${submissionCount} submissions with empty entities and made ${submissionUpdates} updates to submissions`
    );
  } catch (error) {
    console.error('Migration up failed:', error);
    throw error;
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
