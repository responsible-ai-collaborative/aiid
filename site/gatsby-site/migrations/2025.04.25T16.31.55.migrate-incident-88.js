/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  try {
    await client.connect();
    const db = client.db('aiidprod');

    const incidents = db.collection('incidents');

    const reports = db.collection('reports');

    const duplicates = db.collection('duplicates');

    const classifications = db.collection('classifications');

    // Find incident 88
    const incident88 = await incidents.findOne({ incident_id: 88 });

    if (!incident88) {
      console.error('Incident 88 not found. Migration cannot proceed.');
      return;
    }

    // Get reports associated with incident 88
    const incident88Reports = incident88.reports;

    // Find the last incident to determine the new incident_id
    const lastIncident = await incidents.find({}).sort({ incident_id: -1 }).limit(1).next();

    // Calculate new incident_id
    if (!lastIncident) {
      throw new Error('No incidents found. Migration cannot proceed.');
    }

    const incident_id = lastIncident.incident_id + 1;

    delete incident88._id; // Remove _id to avoid duplication error

    // Create new incident object
    const newIncident = {
      ...incident88,
      incident_id,
    };

    // Mark reports as quiet
    await reports.updateMany(
      { report_number: { $in: incident88Reports } },
      { $set: { quiet: true } }
    );

    // Insert new incident
    await incidents.insertOne(newIncident);

    // Record duplication
    await duplicates.insertOne({
      duplicate_incident_number: 88,
      true_incident_number: incident_id,
    });

    // Remove reports from incident 88
    await incidents.updateOne({ incident_id: 88 }, { $set: { reports: [] } });

    console.log(
      `Inserted new incident with ID: ${incident_id} and marked Incident 88 as duplicate.`
    );

    // Update classifications to new incident_id
    await classifications.updateMany({ incident_id: 88 }, { $set: { incident_id: incident_id } });
  } catch (error) {
    console.error('Migration up failed:', error);
    throw error;
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  try {
    await client.connect();
    const db = client.db('aiidprod');

    const incidents = db.collection('incidents');

    const reports = db.collection('reports');

    const duplicates = db.collection('duplicates');

    const classifications = db.collection('classifications');

    // Find the new incident created
    const newIncident = await duplicates.findOne({ duplicate_incident_number: 88 });

    if (!newIncident) return;

    const newIncidentId = newIncident.true_incident_number;

    // Remove the new incident
    await incidents.deleteOne({ incident_id: newIncidentId });
    console.log('Removed new incident with ID:', newIncidentId);

    // Remove the duplication record
    await duplicates.deleteOne({ true_incident_number: newIncidentId });

    // Revert classifications to original incident_id
    await classifications.updateMany({ incident_id: newIncidentId }, { $set: { incident_id: 88 } });

    // Unmark reports as quiet
    const incident88Reports = newIncident?.reports || [];

    await reports.updateMany(
      { report_number: { $in: incident88Reports } },
      { $set: { quiet: false } }
    );

    // Restore reports to incident 88
    await incidents.updateOne({ incident_id: 88 }, { $set: { reports: incident88Reports } });
  } catch (error) {
    console.error('Migration down failed:', error);
    throw error;
  }
};
