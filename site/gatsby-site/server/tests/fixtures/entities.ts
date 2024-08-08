import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { Entity, EntityInsertType, EntityUpdateType } from "../../generated/graphql";

const entity1 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    entity_id: 'entity1',
    name: 'Entity One',
    created_at: new Date("2020-09-14T00:00:00.000Z"),
};

const entity2 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    entity_id: 'entity2',
    name: 'Entity Two',
    created_at: new Date("2020-09-14T00:00:00.000Z"),
};

const entity3 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    entity_id: 'entity3',
    name: 'Entity Three',
    created_at: new Date("2021-09-14T00:00:00.000Z"),
};

const subscriber = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    first_name: 'Subscriber',
    last_name: 'One',
    roles: ['subscriber'],
    userId: 'subscriber',
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

const fixture: Fixture<Entity, EntityUpdateType, EntityInsertType> = {
    name: 'entity',
    query: `
        _id
        entity_id
        name
        created_at
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
            entities: [
                entity1,
                entity2,
                entity3,
            ],
        },
    },
    testSingular: {
        allowed: [anonymous],
        denied: [],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: {
            _id: '60a7c5b7b4f5b8a6d8f9c7e4',
            entity_id: 'entity1',
            name: 'Entity One',
            created_at: "2020-09-14T00:00:00.000Z",
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
                _id: '60a7c5b7b4f5b8a6d8f9c7e4',
                entity_id: 'entity1',
                name: 'Entity One',
                created_at: "2020-09-14T00:00:00.000Z",
            }
        ],
    },
    testPluralSort: {
        allowed: [anonymous],
        denied: [],
        sort: { _id: "ASC" },
        result: [
            { entity_id: 'entity1' },
            { entity_id: 'entity2' },
            { entity_id: 'entity3' },
        ],
    },
    testPluralPagination: {
        allowed: [anonymous],
        denied: [],
        pagination: { limit: 2, skip: 2 },
        sort: { _id: "ASC" },
        result: [
            { entity_id: 'entity3' },
        ]
    },
    testUpdateOne: {
        allowed: [anonymous],
        denied: [],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        update: { set: { name: 'Updated Entity One' } },
        result: { name: 'Updated Entity One' }
    },
    testUpsertOne: {
        shouldInsert: {
            allowed: [anonymous],
            denied: [],
            filter: { entity_id: { EQ: "new-entity" } },
            update: { entity_id: 'new-entity', name: 'Updated New Entity' },
            result: { name: 'Updated New Entity', entity_id: "new-entity", _id: expect.any(String) }
        },
        shouldUpdate: {
            allowed: [anonymous],
            denied: [],
            filter: { entity_id: { EQ: "entity1" } },
            update: { entity_id: 'entity1', name: 'Updated Entity One' },
            result: { name: 'Updated Entity One', _id: '60a7c5b7b4f5b8a6d8f9c7e4' }
        },
    },
    testUpdateMany: null,
    testInsertOne: null,
    testInsertMany: null,
    testDeleteOne: null,
    testDeleteMany: null,
};

export default fixture;