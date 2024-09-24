import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { Taxa } from "../../generated/graphql";

const taxa1: Taxa = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    complete_entities: true,
    description: "This is a description",
    dummy_fields: [],
    field_list: [],
    weight: 1,
    namespace: "namespace1",
}

const taxa2: Taxa = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    complete_entities: true,
    description: "This is a description",
    dummy_fields: [],
    field_list: [],
    weight: 1,
    namespace: "namespace2",
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

const fixture: Fixture<Taxa, Taxa, Taxa> = {
    name: 'taxa',
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
                taxa1,
                taxa2,
            ],
        }
    },
    testSingular: {
        allowed: [anonymous, subscriber],
        denied: [],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: { _id: '60a7c5b7b4f5b8a6d8f9c7e4' }
    },
    testPluralFilter: {
        allowed: [anonymous, subscriber],
        denied: [],
        filter: {
            _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') },
        },
        result: [
            { _id: '60a7c5b7b4f5b8a6d8f9c7e4' }
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

    testUpdateOne: null,
    testUpdateMany: null,
    testInsertOne: null,
    testInsertMany: null,
    testDeleteOne: null,
    testDeleteMany: null,
    testUpsertOne: null,
};

export default fixture;