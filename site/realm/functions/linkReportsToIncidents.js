const incidentEmbedding = (reports) => {
  reports = reports.filter((report) => report.embedding);
  return reports.length == 0
    ? null
    : {
      vector: reports
        .map((report) => report.embedding.vector)
        .reduce(
          (sum, vector) => vector.map((component, i) => component + sum[i]),
          Array(reports[0].embedding.vector.length).fill(0)
        )
        .map((component) => component / reports.length),

      from_reports: reports.map((report) => report.report_number),
    };
};

exports = async (input) => {

  const incidentsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("incidents");
  const reportsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");

  // unlink

  const exParentIncidents = await incidentsCollection.find({ reports: { $in: input.report_numbers } }).toArray();

  for (const incident of exParentIncidents) {

    const reports = await reportsCollection.find({ report_number: { $in: incident.reports.filter(number => !input.report_numbers.includes(number)) } }).toArray();

    const embedding = incidentEmbedding(reports);

    const operation = embedding == null ? { $unset: { embedding: "" } } : { $set: { embedding } }

    await incidentsCollection.updateOne({ incident_id: incident.incident_id }, operation);
  }

  await incidentsCollection.updateMany({ reports: { $in: input.report_numbers } }, { $pull: { reports: { $in: input.report_numbers.map(BSON.Int32) } } });


  // link

  if (input.incident_ids.length > 0) {

    await incidentsCollection.updateMany({ incident_id: { $in: input.incident_ids } }, { $addToSet: { reports: { $each: input.report_numbers.map(BSON.Int32) } } });

    const parentIncidents = await incidentsCollection.find({ reports: { $in: input.report_numbers } }).toArray();

    for (const incident of parentIncidents) {

      const reports = await reportsCollection.find({ report_number: { $in: incident.reports } }).toArray();

      const embedding = incidentEmbedding(reports);

      const operation = embedding == null ? { $unset: { embedding: "" } } : { $set: { embedding } }

      await incidentsCollection.updateOne({ incident_id: incident.incident_id }, operation);
    }
  }

  //

  await reportsCollection.updateMany(
    {
      report_number: { $in: input.report_numbers },
      text_inputs: { $in: [null, ""] },
      text_outputs: { $in: [null, ""] },
    },
    {
      $set: { is_incident_report: input.incident_ids.length > 0 }
    }
  );

  return incidentsCollection.find({ reports: { $in: input.report_numbers } }).toArray();
};

if (typeof module === 'object') {
  module.exports = exports;
}