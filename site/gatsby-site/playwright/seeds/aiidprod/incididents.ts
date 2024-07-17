import { Incident } from '../../../server/generated/graphql'

type DBIncident = Omit<Incident, 'AllegedDeployerOfAISystem' | 'AllegedDeveloperOfAISystem' | 'AllegedHarmedOrNearlyHarmedParties' | 'reports' | 'editors'>
    & { "Alleged deployer of AI system": string[], "Alleged developer of AI system": string[], "Alleged harmed or nearly harmed parties": string[] }
    & { reports: number[] }
    & { editors: string[] }

const incidents: DBIncident[] = [
    {
        incident_id: 1,
        title: "Incident 1",
        date: "2020-01-01",
        "Alleged deployer of AI system": ["entity1"],
        "Alleged developer of AI system": ["entity2"],
        "Alleged harmed or nearly harmed parties": ["entity3"],
        editors: ["editor1"],
        reports: [1],

        // this aren't required but break the build if missing
        nlp_similar_incidents: [],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],

    }
]

export default incidents;