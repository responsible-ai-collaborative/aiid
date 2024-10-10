import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { Duplicate, DuplicateUpdateType, DuplicateInsertType } from "../../generated/graphql";
import { DBDuplicate } from "../../../playwright/seeds/aiidprod/duplicates";

const duplicate1: DBDuplicate = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e1'),
    duplicate_incident_number: 1,
    true_incident_number: 2,
}

const duplicate2: DBDuplicate = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e2'),
    duplicate_incident_number: 3,
    true_incident_number: 4,
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

const admin = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e8'),
    first_name: 'Admin',
    last_name: 'Admin',
    roles: ['admin'],
    userId: 'admin',
}

const fixture: Fixture<Duplicate, DuplicateUpdateType, DuplicateInsertType> = {
    name: 'duplicates',
    query: `
        _id
        duplicate_incident_number
        true_incident_number
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                editor,
                anonymous,
                admin,
            ],
        },
        aiidprod: {
            duplicates: [
                duplicate1,
                duplicate2,
            ],
        }
    },
    testSingular: {
        allowed: [anonymous, subscriber, admin, editor],
        denied: [],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e1') } },
        result: {
            _id: "60a7c5b7b4f5b8a6d8f9c7e1",
            duplicate_incident_number: 1,
            true_incident_number: 2,
        }
    },
    testPluralFilter: {
        allowed: [anonymous, subscriber, admin, editor],
        denied: [],
        filter: {
            _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e1') }
        },
        result: [
            {
                _id: "60a7c5b7b4f5b8a6d8f9c7e1",
            },
        ]
    },
    testPluralSort: {
        allowed: [anonymous, subscriber, admin, editor],
        denied: [],
        sort: { _id: "ASC" },
        filter: {},
        result: [
            {
                _id: "60a7c5b7b4f5b8a6d8f9c7e1",
            },
            {
                _id: "60a7c5b7b4f5b8a6d8f9c7e2",
            },
        ],
    },
    testPluralPagination: {
        allowed: [admin, editor, subscriber, anonymous],
        denied: [],
        pagination: { limit: 1, skip: 1 },
        sort: { _id: "ASC" },
        result: [
            { _id: "60a7c5b7b4f5b8a6d8f9c7e2" },
        ]
    },
    testUpdateOne: null,
    testUpdateMany: null,
    testInsertOne: {
        allowed: [editor, admin],
        denied: [subscriber, anonymous],
        insert: {
            duplicate_incident_number: 5,
            true_incident_number: 6,
        },
        result: {
            _id: expect.any(String),
            duplicate_incident_number: 5,
            true_incident_number: 6,
        }
    },
    testInsertMany: null,
    testDeleteOne: null,
    testDeleteMany: null,
    testUpsertOne: null,
}

export default fixture;