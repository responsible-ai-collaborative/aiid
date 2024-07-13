import { ObjectId } from "bson";
import { Fixture, serializeId } from "../utils";
import { Quickadd, QuickaddFilterType, QuickaddInsertType, QuickaddUpdateInput, QuickaddUpdateType } from "../../generated/graphql";

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

const subscriber = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    first_name: 'Subscriber',
    last_name: 'One',
    roles: ['subscriber'],
    userId: 'subscriber1',
}

const admin = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    first_name: 'Super',
    last_name: 'Man',
    roles: ['admin'],
    userId: 'admin',
}

const anonymous = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e9'),
    first_name: 'Anon',
    last_name: 'Anon',
    roles: [],
    userId: 'anon',
}

const fixture: Fixture<Quickadd, QuickaddUpdateType, QuickaddInsertType> = {
    name: 'quickadd',
    query: `
        date_submitted
        incident_id
        source_domain
        url
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                admin,
                anonymous,
            ]
        },
        aiidprod: {
            quickadd: [
                quickadd1,
                quickadd2,
                quickadd3,
            ],
        }
    },
    testSingular: {
        allowed: [subscriber],
        denied: [],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: serializeId(quickadd1)
    },
    testPluralFilter: {
        allowed: [subscriber],
        denied: [],
        filter: {
            _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') },
        },
        result: [
            serializeId(quickadd1)
        ],
    },
    testPluralSort: {
        allowed: [subscriber],
        denied: [],
        sort: { _id: "ASC" },
        result: [
            { _id: '60a7c5b7b4f5b8a6d8f9c7e4' },
            { _id: '60a7c5b7b4f5b8a6d8f9c7e5' },
            { _id: '60a7c5b7b4f5b8a6d8f9c7e6' },
        ],
    },
    testPluralPagination: {
        allowed: [subscriber],
        denied: [],
        pagination: { skip: 2, limit: 2 },
        sort: { _id: "ASC" },
        result: [
            { _id: '60a7c5b7b4f5b8a6d8f9c7e6' }
        ]
    },

    testUpdateOne: {
        allowed: [admin],
        denied: [subscriber],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        update: { set: { url: 'https://edited.com' } },
        result: { url: 'https://edited.com' }
    },
    testUpdateMany: {
        allowed: [admin],
        denied: [subscriber],
        filter: { incident_id: { EQ: 2 } },
        update: { set: { url: 'https://edited.com' } },
        result: { modifiedCount: 2, matchedCount: 2 }
    },
    testInsertOne: {
        allowed: [anonymous],
        denied: [],
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
        allowed: [admin],
        denied: [anonymous],
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
    },
    testDeleteOne: {
        allowed: [admin],
        denied: [anonymous],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: { _id: '60a7c5b7b4f5b8a6d8f9c7e4' }
    },
    testDeleteMany: {
        allowed: [admin],
        denied: [anonymous],
        filter: { incident_id: { EQ: 2 } },
        result: { deletedCount: 2 },
    }
}

export default fixture;