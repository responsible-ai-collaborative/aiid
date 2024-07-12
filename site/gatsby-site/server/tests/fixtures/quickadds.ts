import { ObjectId } from "bson";
import { Fixture, serializeId } from "../utils";
import { Quickadd } from "../../generated/graphql";

const quickadd1 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    date_submitted: "2020-09-14T00:00:00.000Z",
    incident_id: 1,
    source_domain: "example.com",
    url: "http://example.com"
}

const quickadd2 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    date_submitted: "2020-09-14T00:00:00.000Z",
    incident_id: 2,
    source_domain: "example2.com",
    url: "http://example2.com"
}

const quickadd3 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    date_submitted: "2021-09-14T00:00:00.000Z",
    incident_id: 2,
    source_domain: "example3.com",
    url: "http://example3.com"
}

const quickadd4 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e7'),
    date_submitted: "2021-09-14T00:00:00.000Z",
    incident_id: 2,
    source_domain: "example4.com",
    url: "http://example4.com"
}

const quickadd5 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e8'),
    date_submitted: "2024-09-14T00:00:00.000Z",
    incident_id: 3,
    source_domain: "example5.com",
    url: "http://example5.com"
}


const fixture: Fixture<Quickadd> = {
    name: 'quickadd',
    query: `
        date_submitted
        incident_id
        source_domain
        url
    `,
    seeds: {
        quickadd: [
            quickadd1,
            quickadd2,
            quickadd3,
            quickadd4,
            quickadd5
        ],
    },
    testSingular: {
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: serializeId(quickadd1)
    },
    testPluralFilter: {
        filter: {
            _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') },
        },
        result: [
            serializeId(quickadd1)
        ],
    },
    testPluralSort: {
        sort: { _id: "ASC" },
        result: [
            serializeId(quickadd1),
            serializeId(quickadd2),
            serializeId(quickadd3),
            serializeId(quickadd4),
            serializeId(quickadd5),
        ],
    },
    testPluralPagination: {
        pagination: { limit: 2, skip: 2 },
        sort: { _id: "ASC" },
        result: [
            serializeId(quickadd3),
            serializeId(quickadd4),
        ]
    },

    testUpdateOne: {
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        set: { url: 'https://edited.com' },
        result: { url: 'https://edited.com' }
    },
    testUpdateMany: {
        filter: { incident_id: { EQ: 2 } },
        set: { url: 'https://edited.com' },
        result: { modifiedCount: 3, matchedCount: 3 }
    },
    testInsertOne: {
        insert: {
            date_submitted: "2020-09-14T00:00:00.000Z",
            incident_id: 1,
            source_domain: "example.com",
            url: "http://example.com"
        },
        result: {
            _id: expect.any(String),
            date_submitted: "2020-09-14T00:00:00.000Z",
            incident_id: 1,
            source_domain: "example.com",
            url: "http://example.com"
        }
    },
    testInsertMany: {
        insert: [
            {
                date_submitted: "2020-09-14T00:00:00.000Z",
                incident_id: 1,
                source_domain: "example.com",
                url: "http://example.com"
            },
            {
                date_submitted: "2020-09-14T00:00:00.000Z",
                incident_id: 2,
                source_domain: "example2.com",
                url: "http://example2.com"
            }
        ],
        result: { insertedIds: [expect.any(String), expect.any(String)] }
    }
    ,
    testDeleteOne: {
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: { _id: '60a7c5b7b4f5b8a6d8f9c7e4' }
    },
    testDeleteMany: {
        filter: { incident_id: { EQ: 2 } },
        result: { deletedCount: 3 },
    },
    roles: {
        singular: [],
        plural: [],
        insertOne: [],
        insertMany: ['admin'],
        updateOne: ['admin'],
        updateMany: ['admin'],
        deleteOne: ['admin'],
        deleteMany: ['admin'],
    },
}

export default fixture;