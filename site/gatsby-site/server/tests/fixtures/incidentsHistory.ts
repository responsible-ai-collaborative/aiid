import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { History_Incident } from "../../generated/graphql";
import { DBIncidentHistory } from "../../interfaces";

const subscriber = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    first_name: 'Subscriber',
    last_name: 'One',
    roles: ['subscriber'],
    userId: 'subscriber1',
}

const editor1 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    first_name: 'John',
    last_name: 'Doe',
    roles: ['incident_editor'],
    userId: 'editor1',
};

const anonymous = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    first_name: 'Anon',
    last_name: 'Anon',
    roles: [],
    userId: 'anon',
};

const incident1: DBIncidentHistory = {
    _id: new ObjectId("60a7c5b7b4f5b8a6d8f9c7e0"),
    incident_id: 1,
    date: "2023-01-14T00:00:00.000Z",
    "Alleged deployer of AI system": [],
    "Alleged developer of AI system": [],
    "Alleged harmed or nearly harmed parties": [],
    implicated_systems: [],
    description: "Test description 1",
    title: "Test Incident 1",
    editors: [
        "editor1"
    ],
    nlp_similar_incidents: [
        {
            incident_id: 2,
            similarity: 0.9
        },
        {
            incident_id: 3,
            similarity: 0.85
        }
    ],
    editor_similar_incidents: [],
    editor_dissimilar_incidents: [],
    flagged_dissimilar_incidents: [],
    embedding: {
        vector: [
            0.1,
            0.2,
        ],
        from_reports: [
            105,
            104,
        ],
    },
    tsne: {
        x: -0.1,
        y: -0.2
    },
    reports: [1, 2],
    editor_notes: "Sample editor notes",
};

const incident2: DBIncidentHistory = {
    _id: new ObjectId("60a7c5b7b4f5b8a6d8f9c7e1"),
    incident_id: 2,
    date: "2023-02-14T00:00:00.000Z",
    "Alleged deployer of AI system": [
        "entity1",
        "entity2"
    ],
    "Alleged developer of AI system": [
        "entity1"
    ],
    "Alleged harmed or nearly harmed parties": [],
    implicated_systems: [],
    description: "Test description 2",
    title: "Test Incident 2",
    editors: [
        "editor1"
    ],
    nlp_similar_incidents: [
        {
            incident_id: 1,
            similarity: 0.92
        },
        {
            incident_id: 4,
            similarity: 0.87
        }
    ],
    editor_similar_incidents: [],
    editor_dissimilar_incidents: [],
    flagged_dissimilar_incidents: [],
    embedding: {
        vector: [
            0.6,
            0.7,
        ],
        from_reports: [
            205,
            204,
        ],
    },
    tsne: {
        x: -0.3,
        y: -0.4
    },
    reports: [3],
    editor_notes: "",
};

const incident3: DBIncidentHistory = {
    _id: new ObjectId("60a7c5b7b4f5b8a6d8f9c7e2"),
    incident_id: 3,
    date: "2023-03-14T00:00:00.000Z",
    "Alleged deployer of AI system": [
        "test deployer 5",
        "test deployer 6"
    ],
    "Alleged developer of AI system": [
        "test developer 3"
    ],
    "Alleged harmed or nearly harmed parties": [
        "test harmed party 3"
    ],
    implicated_systems: ['test system 1'],
    description: "Test description 3",
    title: "Test Incident 3",
    editors: [],
    nlp_similar_incidents: [
        {
            incident_id: 4,
            similarity: 0.91
        },
        {
            incident_id: 1,
            similarity: 0.89
        }
    ],
    editor_similar_incidents: [],
    editor_dissimilar_incidents: [],
    flagged_dissimilar_incidents: [],
    embedding: {
        vector: [
            1.1,
            1.2,
        ],
        from_reports: [
            305,
            304,
        ],
    },
    tsne: {
        x: -0.5,
        y: -0.6
    },
    reports: [2, 3],
    editor_notes: "",
};

const fixture: Fixture<History_Incident, any, any> = {
    name: 'history_incident',
    query: `
        _id
        AllegedDeployerOfAISystem 
        AllegedDeveloperOfAISystem
        AllegedHarmedOrNearlyHarmedParties
        date
        description
        editor_dissimilar_incidents
        editor_notes
        editors
        editor_similar_incidents
        embedding {
            from_reports
            vector
        }
        epoch_date_modified
        flagged_dissimilar_incidents
        incident_id
        nlp_similar_incidents {
            incident_id
            similarity
        }
        title
        tsne {
            x
            y
        }
        reports
        modifiedBy
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                editor1,
                anonymous,
            ],
        },
        history: {
            incidents: [
                incident1,
                incident2,
                incident3,
            ],
        },
    },
    testSingular: {
        allowed: [anonymous, subscriber],
        denied: [],
        filter: { reports: { IN: [1] } },
        result: {
            incident_id: 1,
            title: 'Test Incident 1',
            date: '2023-01-14T00:00:00.000Z',
            reports: [1, 2]
        },
    },
    testPluralFilter: {
        allowed: [anonymous, subscriber],
        denied: [],
        filter: {
            _id: { EQ: incident1._id },
        },
        result: [
            { incident_id: 1 },
        ]
    },
    testPluralSort: {
        allowed: [subscriber],
        denied: [],
        sort: { incident_id: "ASC" },
        result: [
            { incident_id: 1 },
            { incident_id: 2 },
            { incident_id: 3 },
        ],
    },
    testPluralPagination: {
        allowed: [subscriber],
        denied: [],
        pagination: { limit: 2, skip: 1 },
        sort: { incident_id: "ASC" },
        result: [
            { incident_id: 2 },
            { incident_id: 3 },
        ]
    },
    testUpdateOne: null,
    testUpdateMany: null,
    testInsertOne: null,
    testInsertMany: null,
    testDeleteOne: null,
    testDeleteMany: null,
    testUpsertOne: null,
}

export default fixture;