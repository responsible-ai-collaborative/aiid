import { DBIncidentHistory } from '../../../server/interfaces';

const items: DBIncidentHistory[] = [
    {
        incident_id: 1,
        title: "Incident 1",
        description: "Incident 1 Description",
        date: "2020-01-01",
        "Alleged deployer of AI system": ["entity-1"],
        "Alleged developer of AI system": ["entity-2"],
        "Alleged harmed or nearly harmed parties": ["entity-3"],
        editors: ["user1"],
        reports: [1],
        modifiedBy: "user1",

    // TODO: this aren't required but break the build if missing
        editor_notes: "",
        nlp_similar_incidents: [],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],
        flagged_dissimilar_incidents: [],
    },
]

export default items;