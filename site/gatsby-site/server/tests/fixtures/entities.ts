import { ObjectId } from "bson";
import { Fixture, serializeId } from "../utils";
import { Entity } from "../../generated/graphql"; // Assuming this is where the EntityType is defined

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

const entity3 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    entity_id: 'entity3',
    name: 'Entity Three',
    created_at: "2021-09-14T00:00:00.000Z",
};

const entity4 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e7'),
    entity_id: 'entity4',
    name: 'Entity Four',
    created_at: "2021-09-14T00:00:00.000Z",
};

const entity5 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e8'),
    entity_id: 'entity5',
    name: 'Entity Five',
    created_at: "2024-09-14T00:00:00.000Z",
};

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

const fixture: Fixture<Entity> = {
    name: 'entity',
    query: `
        _id
        entity_id
        name
        created_at
    `,
    seeds: {
        aiidprod: {
            entities: [
                entity1,
                entity2,
                entity3,
                entity4,
                entity5,
            ],
        }
    },
    testSingular: {
        allowed: anonymous,
        denied: null,
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: serializeId(entity1)
    },
    testPluralFilter: {
        allowed: anonymous,
        denied: null,
        filter: {
            _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') },
        },
        result: [
            serializeId(entity1)
        ],
    },
    testPluralSort: {
        allowed: anonymous,
        denied: null,
        sort: { _id: "ASC" },
        result: [
            serializeId(entity1),
            serializeId(entity2),
            serializeId(entity3),
            serializeId(entity4),
            serializeId(entity5),
        ],
    },
    testPluralPagination: {
        allowed: anonymous,
        denied: null,
        pagination: { limit: 2, skip: 2 },
        sort: { _id: "ASC" },
        result: [
            serializeId(entity3),
            serializeId(entity4),
        ]
    },

    testUpdateOne: {
        allowed: admin,
        denied: anonymous,
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        set: { name: 'Updated Entity One' },
        result: { name: 'Updated Entity One' }
    },
    testUpdateMany: {
        allowed: admin,
        denied: anonymous,
        filter: { entity_id: { IN: ['entity1', 'entity2'] } },
        set: { name: 'Updated Entity' },
        result: { modifiedCount: 2, matchedCount: 2 }
    },
    testInsertOne: {
        allowed: admin,
        denied: anonymous,
        insert: {
            entity_id: 'entity6',
            name: 'Entity Six',
            created_at: "2020-09-14T00:00:00.000Z",
        },
        result: {
            _id: expect.any(String),
            entity_id: 'entity6',
            name: 'Entity Six',
            created_at: "2020-09-14T00:00:00.000Z",
        }
    },
    testInsertMany: {
        allowed: admin,
        denied: anonymous,
        insert: [
            {
                entity_id: 'entity7',
                name: 'Entity Seven',
                created_at: "2020-09-14T00:00:00.000Z",
            },
            {
                entity_id: 'entity8',
                name: 'Entity Eight',
                created_at: "2020-09-14T00:00:00.000Z",
            }
        ],
        result: { insertedIds: [expect.any(String), expect.any(String)] }
    },
    testDeleteOne: {
        allowed: admin,
        denied: anonymous,
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: { _id: '60a7c5b7b4f5b8a6d8f9c7e4' }
    },
    testDeleteMany: {
        allowed: admin,
        denied: anonymous,
        filter: { entity_id: { IN: ['entity1', 'entity2'] } },
        result: { deletedCount: 2 },
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
};

export default fixture;