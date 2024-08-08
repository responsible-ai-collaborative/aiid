import { MongoClient } from "mongodb";
import { incidentEmbedding } from "./incidents";

export const linkReportsToIncidents = async (client: MongoClient, report_numbers: number[], incident_ids: number[]) => {

    const incidentsCollection = client.db('aiidprod').collection("incidents");
    const reportsCollection = client.db('aiidprod').collection("reports");

    // unlink

    const exParentIncidents = await incidentsCollection.find({ reports: { $in: report_numbers } }).toArray();

    for (const incident of exParentIncidents) {

        const reports = await reportsCollection.find({ report_number: { $in: incident.reports.filter((number: number) => !report_numbers.includes(number)) } }).toArray();

        const embedding = incidentEmbedding(reports);

        const operation = embedding == null ? { $unset: { embedding: "" } } : { $set: { embedding } }

        await incidentsCollection.updateOne({ incident_id: incident.incident_id }, operation);
    }

    // @ts-ignore
    await incidentsCollection.updateMany({ reports: { $in: report_numbers } }, { $pull: { reports: { $in: report_numbers } } });


    // link

    if (incident_ids.length > 0) {

        await incidentsCollection.updateMany({ incident_id: { $in: incident_ids } }, { $addToSet: { reports: { $each: report_numbers } } });

        const parentIncidents = await incidentsCollection.find({ reports: { $in: report_numbers } }).toArray();

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
            report_number: { $in: report_numbers },
            title: { $nin: [""] },
            url: { $nin: [""] },
            source_domain: { $nin: [""] },
        },
        {
            $set: { is_incident_report: incident_ids.length > 0 }
        }
    );
}