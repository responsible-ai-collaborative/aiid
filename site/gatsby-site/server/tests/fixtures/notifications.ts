import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { Subscription, SubscriptionUpdateType, SubscriptionInsertType } from "../../generated/graphql";
import { DBNotification } from "../../interfaces";

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

const notification1: DBNotification = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e3'),
    entity_id: 'entity-1',
    type: 'entity',
    userId: subscriber.userId,
}

const notification2: DBNotification = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    type: 'incident',
    userId: subscriber.userId,
    incident_id: 1,
}


const fixture: Fixture<Subscription, SubscriptionUpdateType, SubscriptionInsertType> = {
    name: 'subscriptions',
    query: `
        _id
        entityId {
            entity_id
        }
        incident_id {
            incident_id
        }
        type
        userId {
            userId
        }
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                editor,
                anonymous,
                admin,
            ],
            notifications: [
                notification1,
                notification2,
            ],
        },
    },
    testSingular: {
        allowed: [admin],
        denied: [anonymous, subscriber, editor],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: {
            _id: "60a7c5b7b4f5b8a6d8f9c7e4",
        }
    },
    testPluralFilter: {
        allowed: [admin],
        denied: [anonymous, subscriber, editor],
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
        allowed: [admin],
        denied: [anonymous, subscriber, editor],
        sort: { type: "ASC" },
        filter: { userId: { EQ: subscriber.userId } },
        result: [
            {
                _id: "60a7c5b7b4f5b8a6d8f9c7e4",
            },
            {
                _id: "60a7c5b7b4f5b8a6d8f9c7e3",
            },
        ],
    },
    testPluralPagination: {
        allowed: [admin],
        denied: [subscriber, editor, anonymous],
        pagination: { limit: 1, skip: 2 },
        sort: { _id: "ASC" },
        result: [
            { _id: "60a7c5b7b4f5b8a6d8f9c7e7" },
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