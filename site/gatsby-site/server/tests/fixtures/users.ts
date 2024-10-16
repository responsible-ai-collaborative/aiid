import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { User, UserUpdateType } from "../../generated/graphql";

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

const fixture: Fixture<User, UserUpdateType> = {
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
        allowed: [anonymous],
        denied: [],
        filter: { userId: { EQ: 'user2' } },
        result: {
            first_name: 'Jane',
            last_name: 'Doe',
            roles: ['subscriber'],
            userId: 'user2',
        }
    },
    testPluralFilter: {
        allowed: [admin, subscriber, anonymous],
        denied: [],
        filter: {
            userId: { IN: ['user1', 'user3'] },
        },
        result: [
            {
                first_name: 'John',
                last_name: 'Doe',
                roles: ['admin'],
                userId: 'user1',
            },
            {
                first_name: 'Anon',
                last_name: 'Anon',
                roles: [],
                userId: 'user3',
            },
        ],
    },
    testPluralPagination: {
        allowed: [admin, subscriber, anonymous],
        denied: [],
        pagination: { limit: 1, skip: 1 },
        sort: { first_name: "ASC" },
        result: [
            {
                first_name: 'Jane',
                last_name: 'Doe',
                roles: ['subscriber'],
                userId: 'user2',
            },
        ],
    },
    testPluralSort: {
        allowed: [admin, subscriber, anonymous],
        denied: [],
        sort: { first_name: "ASC" },
        result: [
            {
                first_name: 'Anon',
                last_name: 'Anon',
                roles: [],
                userId: 'user3',
            },
            {
                first_name: 'Jane',
                last_name: 'Doe',
                roles: ['subscriber'],
                userId: 'user2',
            },
            {
                first_name: 'John',
                last_name: 'Doe',
                roles: ['admin'],
                userId: 'user1',
            },
        ],
    },
    testInsertOne: null,
    testInsertMany: null,
    testUpdateOne: {
        allowed: [admin, subscriber,],
        denied: [anonymous],
        filter: { userId: { EQ: 'user2' } },
        update: { set: { first_name: 'Updated John' } },
        result: { first_name: 'Updated John' }
    },
    testUpdateMany: null,
    testDeleteOne: null,
    testDeleteMany: null,
    testUpsertOne: null,
};

export default fixture;