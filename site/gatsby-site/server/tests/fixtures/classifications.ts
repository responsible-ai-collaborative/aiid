import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { Classification, ClassificationInsertType } from "../../generated/graphql";

type DBClassification = Omit<Classification, 'reports' | 'incidents'>
    & { reports: number[] }
    & { incidents: number[] }

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

const incident1 = {
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
    reports: [1],
};

const classification1: DBClassification = {
    _id: new ObjectId("63f3d58c26ab981f33b3f9c7"),
    attributes: [
        {
            short_name: "Harm Distribution Basis",
            value_json: "[]"
        },
        {
            short_name: "Sector of Deployment",
            value_json: "[]"
        },
    ],
    publish: false,
    reports: [1],
    incidents: [1],
    namespace: "CSETv1",
    notes: "",
}

const classification2: DBClassification = {
    _id: new ObjectId("63f3d58c26ab981f33b3f9c8"),
    attributes: [
        {
            short_name: "Harm Distribution Basis",
            value_json: "[]"
        },
        {
            short_name: "Sector of Deployment",
            value_json: "[]"
        },
    ],
    publish: false,
    reports: [],
    incidents: [1],
    namespace: "CSETv2",
    notes: "",
}

const taxa1 = {
    _id: new ObjectId("64c27aef6bd9217f29557f14"),
    namespace: "CSETv1",
    weight: 70,
    complete_entities: true,
    description: "# The CSET Taxonomy 1",
    dummy_fields: [
        {
            field_number: "1",
            short_name: "Test"
        },
    ],
    field_list: [
        {
            field_number: "1.1",
            short_name: "Harm Distribution Basis",
            long_name: "If harms were potentially unevenly distributed among people, on what basis?",
            short_description: "Indicates how the harms were potentially distributed.",
            long_description: "Multiple can occur.\n\nGenetic information refers to information about a person’s genetic tests or the genetic tests of their relatives. Genetic information can predict the manifestation of a disease or disorder.",
            display_type: "multi",
            mongo_type: "string",
            default: "unclear",
            placeholder: "",
            permitted_values: [
                "sexual orientation or gender identity",
                "veteran status",
                "unclear",
                "other"
            ],
            weight: 60,
            instant_facet: false,
            required: false,
            public: true
        },
        {
            field_number: "1.2",
            short_name: "Sector of Deployment",
            long_name: "In which sector was the AI system deployed?",
            short_description: "Indicates the sector in which the AI system was deployed.",
            long_description: "Multiple can occur.\n\nGenetic information refers to information about a person’s genetic tests or the genetic tests of their relatives. Genetic information can predict the manifestation of a disease or disorder.",
            display_type: "multi",
            mongo_type: "string",
            default: "unclear",
            placeholder: "",
            permitted_values: [
                "healthcare",
                "finance",
                "education",
                "other"
            ],
            weight: 40,
            instant_facet: false,
            required: false,
            public: true
        },
    ],
    created_at: new Date("1722269934190")
}

const taxa2 = {
    _id: new ObjectId("64c27aef6bd9217f29557f15"),
    namespace: "CSETv2",
    weight: 70,
    complete_entities: true,
    description: "# The CSET Taxonomy 2",
    dummy_fields: [
        {
            field_number: "1",
            short_name: "Test"
        },
    ],
    field_list: [
        {
            field_number: "1.1",
            short_name: "Harm Distribution Basis",
            long_name: "If harms were potentially unevenly distributed among people, on what basis?",
            short_description: "Indicates how the harms were potentially distributed.",
            long_description: "Multiple can occur.\n\nGenetic information refers to information about a person’s genetic tests or the genetic tests of their relatives. Genetic information can predict the manifestation of a disease or disorder.",
            display_type: "multi",
            mongo_type: "string",
            default: "unclear",
            placeholder: "",
            permitted_values: [
                "sexual orientation or gender identity",
                "veteran status",
                "unclear",
                "other"
            ],
            weight: 60,
            instant_facet: false,
            required: false,
            public: true
        },
        {
            field_number: "1.2",
            short_name: "Sector of Deployment",
            long_name: "In which sector was the AI system deployed?",
            short_description: "Indicates the sector in which the AI system was deployed.",
            long_description: "Multiple can occur.\n\nGenetic information refers to information about a person’s genetic tests or the genetic tests of their relatives. Genetic information can predict the manifestation of a disease or disorder.",
            display_type: "multi",
            mongo_type: "string",
            default: "unclear",
            placeholder: "",
            permitted_values: [
                "healthcare",
                "finance",
                "education",
                "other"
            ],
            weight: 40,
            instant_facet: false,
            required: false,
            public: true
        },
    ],
    created_at: new Date("1722269934190")
}


const fixture: Fixture<Classification, any, ClassificationInsertType> = {
    name: 'classifications',
    query: `
        _id
        attributes {
            short_name
            value_json
        }
        namespace
        notes
        publish
        incidents {
            incident_id
        }
        reports {
            report_number
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
            taxa: [
                taxa1,
                taxa2,
            ],
            classifications: [
                classification1,
                classification2,
            ],
            incidents: [
                incident1,
            ],
            reports: [
                report1,
            ],
        },
    },
    testSingular: {
        allowed: [anonymous, subscriber],
        denied: [],
        filter: { reports: { IN: [1] } },
        result: {
            _id: "63f3d58c26ab981f33b3f9c7",
            namespace: "CSETv1",
            reports: [{ report_number: 1 }],
            incidents: [{ incident_id: 1 }],
        },
    },
    testPluralFilter: {
        allowed: [anonymous, subscriber],
        denied: [],
        filter: {
            _id: { EQ: "63f3d58c26ab981f33b3f9c7" },
        },
        result: [
            {
                _id: "63f3d58c26ab981f33b3f9c7",
                namespace: "CSETv1",
                reports: [{ report_number: 1 }],
                incidents: [{ incident_id: 1 }],
            }
        ]
    },
    testPluralSort: {
        allowed: [anonymous, subscriber],
        denied: [],
        sort: { namespace: "ASC" },
        result: [
            { namespace: "CSETv1", _id: "63f3d58c26ab981f33b3f9c7" },
            { namespace: "CSETv2", _id: "63f3d58c26ab981f33b3f9c8" },
        ],
    },
    testPluralPagination: {
        allowed: [subscriber],
        denied: [],
        pagination: { limit: 1, skip: 1 },
        sort: { namespace: "ASC" },
        result: [
            { namespace: "CSETv2", _id: "63f3d58c26ab981f33b3f9c8" },
        ]
    },
    testUpdateOne: null,
    testUpdateMany: null,
    testInsertOne: null,
    testInsertMany: null,
    testDeleteOne: null,
    testDeleteMany: null,
    testUpsertOne: {
        shouldInsert: {
            allowed: [editor1],
            denied: [anonymous, subscriber],
            filter: { incidents: { EQ: 1 }, namespace: { EQ: "CSETv3" } },
            update: {
                namespace: "CSETv3",
                reports: { link: [1] },
                incidents: { link: [1] },
                publish: true,
                notes: "Inserted classification",
            },
            result: {
                _id: expect.any(String),
                namespace: "CSETv3",
                reports: [{ report_number: 1 }],
                incidents: [{ incident_id: 1 }],
            },

        },
        shouldUpdate: {
            allowed: [editor1],
            denied: [anonymous, subscriber],
            filter: { incidents: { EQ: 1 }, namespace: { EQ: "CSETv2" } },
            update: {
                // targets classification2
                namespace: "CSETv2",
                reports: { link: [] },
                incidents: { link: [1] },
                publish: true,
                notes: "Updated classification",
            },
            result: {
                _id: "63f3d58c26ab981f33b3f9c8",
                namespace: "CSETv2",
                reports: [],
                incidents: [{ incident_id: 1 }],
            },
        }
    },
}

export default fixture;