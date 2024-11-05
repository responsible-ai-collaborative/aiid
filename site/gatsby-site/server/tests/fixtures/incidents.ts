import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { Incident, IncidentInsertType, IncidentUpdateType } from "../../generated/graphql";
import { DBIncident } from "../../interfaces";

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


const entity1 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    entity_id: 'entity1',
    name: 'Entity One',
    created_at: "2020-09-14T00:00:00.000Z",
};

const entity2 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    entity_id: 'entity2',
    name: 'Entity Two',
    created_at: "2020-09-14T00:00:00.000Z",
};

const report1 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    authors: ["Author 1", "Author 2"],
    cloudinary_id: "sample_cloudinary_id",
    date_downloaded: "2021-09-14T00:00:00.000Z",
    date_modified: "2021-09-14T00:00:00.000Z",
    date_published: "2021-09-14T00:00:00.000Z",
    date_submitted: "2021-09-14T00:00:00.000Z",
    description: "Sample description",
    editor_notes: "Sample editor notes",
    embedding: {
        from_text_hash: "sample_hash",
        vector: [0.1, 0.2, 0.3]
    },
    epoch_date_downloaded: 1631577600,
    epoch_date_modified: 1631577600,
    epoch_date_published: 1631577600,
    epoch_date_submitted: 1631577600,
    flag: false,
    image_url: "http://example.com/image.png",
    inputs_outputs: ["input1", "output1"],
    is_incident_report: true,
    language: "en",
    plain_text: "Sample plain text",
    report_number: 1,
    source_domain: "example.com",
    submitters: ["Submitter 1", "Submitter 2"],
    tags: ["tag1", "tag2"],
    text: "Sample text",
    title: "Sample title",
    url: "http://example.com",
    user: "editor1",
    quiet: false,
}

const report2 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e9'),
    authors: ["Author 5", "Author 6"],
    cloudinary_id: "sample_cloudinary_id_3",
    date_downloaded: "2022-10-14T00:00:00.000Z",
    date_modified: "2022-10-14T00:00:00.000Z",
    date_published: "2022-10-14T00:00:00.000Z",
    date_submitted: "2022-10-14T00:00:00.000Z",
    description: "Another sample description",
    editor_notes: "Another sample editor notes",
    embedding: {
        from_text_hash: "sample_hash_3",
        vector: [0.7, 0.8, 0.9]
    },
    epoch_date_downloaded: 1665705600,
    epoch_date_modified: 1665705600,
    epoch_date_published: 1665705600,
    epoch_date_submitted: 1665705600,
    flag: true,
    image_url: "http://example3.com/image3.png",
    inputs_outputs: ["input3", "output3"],
    is_incident_report: false,
    language: "es",
    plain_text: "Another sample plain text",
    report_number: 2,
    source_domain: "example3.com",
    submitters: ["Submitter 5", "Submitter 6"],
    tags: ["tag5", "tag6"],
    text: "Another sample text",
    title: "Another sample title",
    url: "http://example3.com",
    user: "editor1",
    quiet: true,
}

const report3 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7f4'),
    authors: ["Author 3", "Author 4"],
    cloudinary_id: "sample_cloudinary_id_2",
    date_downloaded: "2021-11-14T00:00:00.000Z",
    date_modified: "2021-11-14T00:00:00.000Z",
    date_published: "2021-11-14T00:00:00.000Z",
    date_submitted: "2021-11-14T00:00:00.000Z",
    description: "Third sample description",
    editor_notes: "Third sample editor notes",
    embedding: {
        from_text_hash: "sample_hash_2",
        vector: [0.4, 0.5, 0.6]
    },
    epoch_date_downloaded: 1636848000,
    epoch_date_modified: 1636848000,
    epoch_date_published: 1636848000,
    epoch_date_submitted: 1636848000,
    flag: false,
    image_url: "http://example2.com/image2.png",
    inputs_outputs: ["input2", "output2"],
    is_incident_report: true,
    language: "fr",
    plain_text: "Third sample plain text",
    report_number: 3,
    source_domain: "example2.com",
    submitters: ["Submitter 3", "Submitter 4"],
    tags: ["tag3", "tag4"],
    text: "Third sample text",
    title: "Third sample title",
    url: "http://example2.com",
    user: "editor1",
    quiet: false,
}

const incident1: DBIncident = {
    _id: new ObjectId("60a7c5b7b4f5b8a6d8f9c7e0"),
    incident_id: 1,
    date: "2023-01-14T00:00:00.000Z",
    "Alleged deployer of AI system": [],
    "Alleged developer of AI system": [],
    "Alleged harmed or nearly harmed parties": [],
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

const incident2: DBIncident = {
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

const incident3: DBIncident = {
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

const fixture: Fixture<Incident, IncidentUpdateType, IncidentInsertType> = {
    name: 'incidents',
    query: `
        _id
        AllegedDeployerOfAISystem {
            entity_id
        }
        AllegedDeveloperOfAISystem {
            entity_id
        }
        AllegedHarmedOrNearlyHarmedParties {
            entity_id
        }
        date
        description
        editor_dissimilar_incidents
        editor_notes
        editors {
            userId
        }
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
        reports {
            report_number
            user {
                userId
            }
        }
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                editor1,
                anonymous,
            ],
        },
        aiidprod: {
            entities: [
                entity1,
                entity2,
            ],
            incidents: [
                incident1,
                incident2,
                incident3,
            ],
            reports: [
                report1,
                report2,
                report3,
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
            reports: [
                { report_number: 1 },
                { report_number: 2 }
            ]
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
    testUpdateOne: {
        allowed: [editor1],
        denied: [anonymous, subscriber],
        filter: { _id: { EQ: incident1._id } },
        update: { set: { title: 'edited title', AllegedDeployerOfAISystem: { link: ['entity1'] } } },
        result: { title: 'edited title', AllegedDeployerOfAISystem: [{ entity_id: 'entity1' }] }
    },
    testUpdateMany: {
        allowed: [editor1],
        denied: [subscriber],
        filter: { incident_id: { EQ: 1 } },
        update: { set: { title: 'edited tile', AllegedDeployerOfAISystem: { link: ['entity1'] } } },
        result: { modifiedCount: 1, matchedCount: 1 }
    },
    testInsertOne: {
        allowed: [editor1],
        denied: [anonymous, subscriber],
        insert: {
            date: '2023-04-14T00:00:00.000Z',
            title: 'Test Incident 4',
            reports: { link: [1, 2] },
            incident_id: 5,
            editors: { link: [editor1.userId] },
            editor_notes: "",
            flagged_dissimilar_incidents: [],
            AllegedDeployerOfAISystem: { link: ['entity1'] },
        },
        result: {
            _id: expect.any(String),
            date: '2023-04-14T00:00:00.000Z',
            title: 'Test Incident 4',
            reports: [
                { report_number: 1 },
                { report_number: 2 }
            ],
            editors: [
                { userId: 'editor1' }
            ],
            AllegedDeployerOfAISystem: [
                { entity_id: 'entity1' }
            ]
        }
    },
    testInsertMany: null,
    testDeleteOne: null,
    testDeleteMany: null,
    testUpsertOne: null,
}

export default fixture;