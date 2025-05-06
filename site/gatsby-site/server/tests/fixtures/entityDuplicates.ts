import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { EntityDuplicate } from "../../generated/graphql";
import { DBEntityDuplicate } from "../../interfaces";

const entityDuplicate1: DBEntityDuplicate = {
    _id: new ObjectId('61a7c5b7b4f5b8a6d8f9c7e1'),
    duplicate_entity_id: 'siri-typo',
    true_entity_id: 'siri',
}

const entityDuplicate2: DBEntityDuplicate = {
    _id: new ObjectId('61a7c5b7b4f5b8a6d8f9c7e2'),
    duplicate_entity_id: 'chatgbt',
    true_entity_id: 'chatgpt',
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

const fixture: Fixture<EntityDuplicate, {}, {}> = {
    name: 'entity_duplicates',
    fieldName: 'entityDuplicate',
    query: `
        _id
        duplicate_entity_id
        true_entity_id
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
            entity_duplicates: [
                entityDuplicate1,
                entityDuplicate2,
            ],
        }
    },
    testSingular: {
        allowed: [anonymous, subscriber, admin, editor],
        denied: [],
        filter: { _id: { EQ: new ObjectId('61a7c5b7b4f5b8a6d8f9c7e1') } },
        result: {
            _id: "61a7c5b7b4f5b8a6d8f9c7e1",
            duplicate_entity_id: "siri-typo",
            true_entity_id: "siri",
        }
    },
    testPluralFilter: {
        allowed: [anonymous, subscriber, admin, editor],
        denied: [],
        filter: {
            _id: { EQ: new ObjectId('61a7c5b7b4f5b8a6d8f9c7e1') }
        },
        result: [
            {
                _id: "61a7c5b7b4f5b8a6d8f9c7e1",
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
                _id: "61a7c5b7b4f5b8a6d8f9c7e1",
            },
            {
                _id: "61a7c5b7b4f5b8a6d8f9c7e2",
            },
        ],
    },
    testPluralPagination: {
        allowed: [admin, editor, subscriber, anonymous],
        denied: [],
        pagination: { limit: 1, skip: 1 },
        sort: { _id: "ASC" },
        result: [
            { _id: "61a7c5b7b4f5b8a6d8f9c7e2" },
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