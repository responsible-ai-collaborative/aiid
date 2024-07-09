import { ObjectId } from "bson";
import { Fixture, serializeId } from "../utils";
import { User } from "../../generated/graphql";

const admin = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    first_name: 'John',
    last_name: 'Doe',
    roles: ['admin'],
    userId: 'user1',
};

const subscriber = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    first_name: 'Jane',
    last_name: 'Doe',
    roles: ['subscriber'],
    userId: 'user2',
};

const anonymous = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    first_name: 'Anon',
    last_name: 'Anon',
    roles: [],
    userId: 'user3',
};

const fixture: Fixture<User> = {
    name: 'users',
    query: `
        _id
        first_name
        last_name
        roles
        userId
    `,
    seeds: {
        customData: {
            users: [
                admin,
                subscriber,
                anonymous,
            ],
        },
    },
    testSingular: {
        allowed: [subscriber],
        denied: [anonymous],
        filter: { userId: { EQ: 'user2' } },
        result: serializeId(subscriber)
    },
    testPluralFilter: {
        allowed: [admin],
        denied: [subscriber, anonymous],
        filter: {
            userId: { IN: ['user1', 'user3'] },
        },
        result: [
            serializeId(admin),
            serializeId(anonymous),
        ],
    },
    testPluralPagination: {
        allowed: [admin],
        denied: [subscriber, anonymous],
        pagination: { limit: 1, skip: 1 },
        sort: { first_name: "ASC" },
        result: [
            serializeId(subscriber),
        ],
    },
    testPluralSort: {
        allowed: [admin],
        denied: [subscriber, anonymous],
        sort: { first_name: "ASC" },
        result: [
            serializeId(anonymous),
            serializeId(subscriber),
            serializeId(admin),
        ],
    },
    testInsertOne: null,
    testInsertMany: null,
    testUpdateOne: {
        allowed: [admin, subscriber],
        denied: [anonymous],
        filter: { userId: { EQ: 'user2' } },
        set: { first_name: 'Updated John' },
        result: { first_name: 'Updated John' }
    },
    testUpdateMany: null,
    testDeleteOne: null,
    testDeleteMany: null,
    roles: {
        singular: ['self'],
        plural: ['admin'],
        updateOne: ['self'],
        updateMany: null,
        insertOne: null,
        insertMany: null,
        deleteOne: null,
        deleteMany: null,
    },
};

export default fixture;