import { ObjectId } from "bson";
import { Fixture, removeField, removeFields, removeId, serializeId } from "../utils";
import { Incident } from "../../generated/graphql";

type DBIncident = Omit<Incident, 'AllegedDeployerOfAISystem' | 'AllegedDeveloperOfAISystem' | 'AllegedHarmedOrNearlyHarmedParties' | 'reports' | 'editors'>
    & { "Alleged deployer of AI system": string[], "Alleged developer of AI system": string[], "Alleged harmed or nearly harmed parties": string[] }
    & { reports: number[] }
    & { editors: string[] }

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

const editor2 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    first_name: 'Jane',
    last_name: 'Doe',
    roles: ['incident_editor'],
    userId: 'editor2',
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
    user: "user1",
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
    user: "user3",
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
    user: "user2",
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
};

const resultIncident1: Incident = {
    ...serializeId(removeFields(incident1, "Alleged deployer of AI system", "Alleged developer of AI system", "Alleged harmed or nearly harmed parties")),
    AllegedDeployerOfAISystem: [],
    AllegedDeveloperOfAISystem: [],
    AllegedHarmedOrNearlyHarmedParties: [],
    reports: [serializeId(report1), serializeId(report2)],
    editors: [serializeId(editor1)]
}

const resultIncident2: Incident = {
    ...serializeId(removeFields(incident2, "Alleged deployer of AI system", "Alleged developer of AI system", "Alleged harmed or nearly harmed parties")),
    AllegedDeployerOfAISystem: [serializeId(entity1), serializeId(entity2)],
    AllegedDeveloperOfAISystem: [serializeId(entity1)],
    AllegedHarmedOrNearlyHarmedParties: [],
    reports: [serializeId(report3)],
    editors: [serializeId(editor1)]
}

const resultIncident3: Incident = {
    ...serializeId(removeFields(incident3, "Alleged deployer of AI system", "Alleged developer of AI system", "Alleged harmed or nearly harmed parties")),
    AllegedDeployerOfAISystem: [],
    AllegedDeveloperOfAISystem: [],
    AllegedHarmedOrNearlyHarmedParties: [],
    reports: [serializeId(report2), serializeId(report3)],
    editors: []
}

const fixture: Fixture<DBIncident, Incident> = {
    name: 'incidents',
    query: `
        _id
        AllegedDeployerOfAISystem {
            _id
            entity_id
            name
            created_at
        }
        AllegedDeveloperOfAISystem {
            _id
            entity_id
            name
            created_at
        }
        AllegedHarmedOrNearlyHarmedParties {
            _id
            entity_id
            name
            created_at
        }
        date
        description
        editor_dissimilar_incidents
        editor_notes
        editors {
            _id
            userId
            first_name
            last_name
            roles
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
            _id
            authors
            cloudinary_id
            date_downloaded
            date_modified
            date_published
            date_submitted
            description
            editor_notes
            embedding {
                from_text_hash
                vector
            }
            epoch_date_downloaded
            epoch_date_modified
            epoch_date_published
            epoch_date_submitted
            flag
            image_url
            inputs_outputs
            is_incident_report
            language
            plain_text
            report_number
            source_domain
            submitters
            tags
            text
            title
            url
            user
            quiet
        }
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                editor1,
                editor2,
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
        allowed: subscriber,
        denied: null,
        filter: { _id: { EQ: incident1._id } },
        result: resultIncident1,
    },
    testPluralFilter: {
        allowed: subscriber,
        denied: null,
        filter: {
            _id: { EQ: incident1._id },
        },
        result: [
            resultIncident1,
        ]
    },
    testPluralSort: {
        allowed: subscriber,
        denied: null,
        sort: { incident_id: "ASC" },
        result: [
            resultIncident1,
            resultIncident2,
            resultIncident3,
        ],
    },
    testPluralPagination: {
        allowed: subscriber,
        denied: null,
        pagination: { limit: 2, skip: 1 },
        sort: { incident_id: "ASC" },
        result: [
            resultIncident2,
            resultIncident3,
        ]
    },
    testUpdateOne: {
        allowed: editor1,
        denied: subscriber,
        filter: { _id: { EQ: incident1._id } },
        set: { title: 'edited title' },
        result: { title: 'edited title' }
    },
    testUpdateMany: {
        allowed: editor1,
        denied: subscriber,
        filter: { incident_id: { EQ: 1 } },
        set: { title: 'edited tile' },
        result: { modifiedCount: 1, matchedCount: 1 }
    },
    testInsertOne: {
        allowed: editor1,
        denied: subscriber,
        insert: {
            ...resultIncident1
        },
        result: {
            ...resultIncident1,
            _id: expect.any(String),
        }
    },
    testInsertMany: {
        allowed: editor1,
        denied: subscriber,
        insert: [
            {
                ...resultIncident1,
            },
            {
                ...resultIncident1,
            },
        ],
        result: { insertedIds: [expect.any(String), expect.any(String)] }
    },
    testDeleteOne: {
        allowed: editor1,
        denied: subscriber,
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: { _id: '60a7c5b7b4f5b8a6d8f9c7e4' }
    },
    testDeleteMany: {
        allowed: editor1,
        denied: subscriber,
        filter: { incident_id: { EQ: 1 } },
        result: { deletedCount: 1 }
    },
    roles: {
        singular: [],
        plural: [],
        insertOne: ['admin'],
        insertMany: ['admin'],
        updateOne: ['admin'],
        updateMany: ['admin'],
        deleteOne: ['admin'],
        deleteMany: ['admin'],
    },
}

export default fixture;