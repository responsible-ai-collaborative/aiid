import { Incident } from '../../../server/generated/graphql'

export type DBIncident = Omit<Incident, 'AllegedDeployerOfAISystem' | 'AllegedDeveloperOfAISystem' | 'AllegedHarmedOrNearlyHarmedParties' | 'reports' | 'editors'>
    & { "Alleged deployer of AI system": string[], "Alleged developer of AI system": string[], "Alleged harmed or nearly harmed parties": string[] }
    & { reports: number[] }
    & { editors: string[] }

const incidents: DBIncident[] = [
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

        // TODO: this aren't required but break the build if missing
        editor_notes: "",
        nlp_similar_incidents: [],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],
        flagged_dissimilar_incidents: [],
    },
    {
        incident_id: 2,
        title: "Incident 2",
        date: "2020-01-01",
        "Alleged deployer of AI system": ["entity-1"],
        "Alleged developer of AI system": ["entity-2"],
        "Alleged harmed or nearly harmed parties": ["entity-3"],
        editors: ["user1"],
        reports: [2],

        // TODO: this aren't required but break the build if missing
        editor_notes: "",
        nlp_similar_incidents: [],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],
        flagged_dissimilar_incidents: [],
    },
    {
        incident_id: 3,
        date: "2014-08-14",
        reports: [
            3,
            4,
            6,
            7,
            8,
        ],
        editor_notes: "",
        "Alleged deployer of AI system": [
            "starbucks"
        ],
        "Alleged developer of AI system": [
            "kronos"
        ],
        "Alleged harmed or nearly harmed parties": [
            "starbucks-employees"
        ],
        description: "Kronos’s scheduling algorithm and its use by Starbucks managers allegedly negatively impacted financial and scheduling stability for Starbucks employees, which disadvantaged wage workers.",
        title: "Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees",
        editors: [
            "619b47ea5eed5334edfa3bbc"
        ],
        nlp_similar_incidents: [
            {
                incident_id: 1,
                similarity: 0.9988328814506531
            },
        ],
        editor_similar_incidents: [],
        editor_dissimilar_incidents: [],
        flagged_dissimilar_incidents: [],
        embedding: {
            vector: [
                -0.06841292232275009,
                0.08255906403064728
            ],
            from_reports: [
                16,
                17
            ]
        },
        tsne: {
            x: 0.0487331398239335,
            y: 0.38604577108881916
        },
        // this field is currently present in the database but not mapped to any graphql fueld
        // "created_at": 1407974400000
    },
]

export default incidents;