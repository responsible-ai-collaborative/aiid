import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { Submission, SubmissionInsertType, SubmissionUpdateType } from "../../generated/graphql";


const entity1 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e1'),
    entity_id: "entity1",
    entity_name: "Entity 1",
}

const entity2 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e2'),
    entity_id: "entity2",
    entity_name: "Entity 2",
}

const submission1 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    authors: ["Author 1", "Author 2"],
    cloudinary_id: "sample_cloudinary_id",
    date_downloaded: "2021-09-14T00:00:00.000Z",
    date_modified: "2021-09-14T00:00:00.000Z",
    date_published: "2021-09-14T00:00:00.000Z",
    date_submitted: "2021-09-14T00:00:00.000Z",
    deployers: ["entity1"],
    description: "Sample description",
    developers: ["entity2"],
    harmed_parties: ["entity3"],
    incident_editors: ["editor1"],
    image_url: "https://sample_image_url.com",
    language: "en",
    source_domain: "example.com",
    submitters: ["Submitter 1", "Submitter 2"],
    tags: ["tag1", "tag2"],
    text: "Sample text",
    title: "Submission 1",
    url: "http://example.com",
    user: "user1",
    implicated_systems: ["entity1"]
}

const submission2 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e9'),
    authors: ["Author 5", "Author 6"],
    cloudinary_id: "sample_cloudinary_id_3",
    date_downloaded: "2022-10-14T00:00:00.000Z",
    date_modified: "2022-10-14T00:00:00.000Z",
    date_published: "2022-10-14T00:00:00.000Z",
    date_submitted: "2022-10-14T00:00:00.000Z",
    deployers: ["entity5"],
    description: "Another sample description",
    developers: ["entity6"],
    harmed_parties: ["entity7"],
    incident_editors: ["editor5"],
    image_url: "https://sample_image_url_3.com",
    language: "en",
    source_domain: "example.com",
    submitters: ["Submitter 1", "Submitter 2"],
    tags: ["tag1", "tag2"],
    text: "Sample text",
    title: "Submission 2",
    url: "http://example.com",
    user: "user1",
    implicated_systems: ["entity1"]
}

const submission3 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e8'),
    authors: ["Author 3", "Author 4"],
    cloudinary_id: "sample_cloudinary_id_4",
    date_downloaded: "2023-11-14T00:00:00.000Z",
    date_modified: "2023-11-14T00:00:00.000Z",
    date_published: "2023-11-14T00:00:00.000Z",
    date_submitted: "2023-11-14T00:00:00.000Z",
    deployers: ["entity3"],
    description: "Another sample description",
    developers: ["entity1"],
    harmed_parties: ["entity5"],
    incident_editors: ["editor3"],
    image_url: "https://sample_image_url_4.com",
    language: "en",
    source_domain: "example.com",
    submitters: ["Submitter 1", "Submitter 2"],
    tags: ["tag1", "tag2"],
    text: "Sample text",
    title: "Submission 3",
    url: "http://example.com",
    user: "user1",
    implicated_systems: ["entity1"]
}


const subscriber = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    first_name: 'Subscriber',
    last_name: 'One',
    roles: ['subscriber'],
    userId: 'subscriber1',
}

const editor = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    first_name: 'Incident',
    last_name: 'Editor',
    roles: ['incident_editor'],
    userId: 'editor1',
}

const anonymous = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e9'),
    first_name: 'Anon',
    last_name: 'Anon',
    roles: [],
    userId: 'anon',
}


const fixture: Fixture<Submission, SubmissionUpdateType, SubmissionInsertType> = {
    name: 'submissions',
    query: `
        _id
        authors
        cloudinary_id
        date_downloaded
        date_modified
        date_published
        date_submitted
        deployers {
            entity_id
        }
        description
        developers {
            entity_id
        }
        editor_dissimilar_incidents
        editor_notes
        editor_similar_incidents
        embedding {
            from_text_hash
            vector
        }
        epoch_date_modified
        harmed_parties {
            entity_id
        }
        image_url
        incident_date
        incident_editors {
            userId
        }
        incident_ids
        incident_title
        language
        nlp_similar_incidents {
            incident_id
        }
        plain_text
        quiet
        source_domain
        status
        submitters
        tags
        text
        title
        url
        user {
            userId
        }
        implicated_systems {
            entity_id
        }
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                editor,
                anonymous,
            ],
        },
        aiidprod: {
            entities: [
                entity1,
                entity2,
            ],
            submissions: [
                submission1,
                submission2,
                submission3,
            ]
        }
    },
    testSingular: {
        allowed: [anonymous],
        denied: [],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: {
            _id: "60a7c5b7b4f5b8a6d8f9c7e4",
        }
    },
    testPluralFilter: {
        allowed: [anonymous],
        denied: [],
        filter: {
            _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') },
        },
        result: [
            {
                _id: "60a7c5b7b4f5b8a6d8f9c7e4"
            },
        ]
    },
    testPluralSort: {
        allowed: [anonymous],
        denied: [],
        sort: { title: "ASC" },
        result: [
            { title: "Submission 1" },
            { title: "Submission 2" },
            { title: "Submission 3" },
        ],
    },
    testPluralPagination: {
        allowed: [anonymous],
        denied: [],
        pagination: { limit: 2, skip: 2 },
        sort: { title: "ASC" },
        result: [
            { title: "Submission 3" },
        ]
    },
    testUpdateOne: {
        allowed: [editor],
        denied: [],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        update: { set: { title: 'Edited' } },
        result: {
            _id: '60a7c5b7b4f5b8a6d8f9c7e4',
            title: 'Edited',
        }
    },
    testUpdateMany: null,
    testInsertOne: {
        allowed: [editor],
        denied: [],
        insert: {
            authors: ["Author 3", "Author 4"],
            cloudinary_id: "sample_cloudinary_id_4",
            date_downloaded: "2023-11-14T00:00:00.000Z",
            date_modified: "2023-11-14T00:00:00.000Z",
            date_published: "2023-11-14T00:00:00.000Z",
            date_submitted: "2023-11-14T00:00:00.000Z",
            deployers: { link: ["entity1"] },
            description: "Another sample description",
            developers: { link: ["entity1"] },
            harmed_parties: { link: ["entity1"] },
            incident_editors: { link: ["editor1"] },
            image_url: "https://sample_image_url_4.com",
            language: "en",
            source_domain: "example.com",
            submitters: ["Submitter 1", "Submitter 2"],
            tags: ["tag1", "tag2"],
            text: "Sample text",
            title: "New Submission",
            url: "http://example.com",
            user: { link: "editor1" },
            implicated_systems: { link: ["entity1"] }
        },
        result: {
            _id: expect.any(String),
            title: "New Submission",
        }
    },
    testInsertMany: null,
    testDeleteOne: {
        allowed: [editor],
        denied: [anonymous],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: { _id: '60a7c5b7b4f5b8a6d8f9c7e4' }
    },
    testDeleteMany: null,
    testUpsertOne: null,
}

export default fixture;