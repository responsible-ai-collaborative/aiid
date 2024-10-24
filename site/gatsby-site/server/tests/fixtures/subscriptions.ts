import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { Subscription, SubscriptionUpdateType, SubscriptionInsertType } from "../../generated/graphql";
import { DBSubscription } from "../../interfaces";

const entity1 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e1'),
    entity_id: "entity1",
    entity_name: "Entity 1",
}

const entity2 = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e2'),
    entity_id: "entity2",
    entity_name: "Entity 2",
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

const incident1 = {
    _id: new ObjectId("60a7c5b7b4f5b8a6d8f9c7e0"),
    incident_id: 1,
    date: "2023-01-14T00:00:00.000Z",
    "Alleged deployer of AI system": [],
    "Alleged developer of AI system": [],
    "Alleged harmed or nearly harmed parties": [],
    description: "Test description 1",
    title: "Test Incident 1",
    editors: [
        "editor1"
    ],
    nlp_similar_incidents: [
        {
            incident_id: 2,
            similarity: 0.9
        },
        {
            incident_id: 3,
            similarity: 0.85
        }
    ],
    editor_similar_incidents: [],
    editor_dissimilar_incidents: [],
    flagged_dissimilar_incidents: [],
    embedding: {
        vector: [
            0.1,
            0.2,
        ],
        from_reports: [
            105,
            104,
        ],
    },
    tsne: {
        x: -0.1,
        y: -0.2
    },
    reports: [1, 2],
};

const subscription1: DBSubscription = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    entityId: entity1.entity_id,
    incident_id: undefined,
    type: "entity",
    userId: subscriber.userId,
}

const subscription2: DBSubscription = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e3'),
    entityId: entity2.entity_id,
    incident_id: undefined,
    type: "entity",
    userId: subscriber.userId,
}

const subscription3: DBSubscription = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e7'),
    entityId: undefined,
    incident_id: incident1.incident_id,
    type: "incident",
    userId: editor.userId,
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
            subscriptions: [
                subscription1,
                subscription2,
                subscription3,
            ],
        },
        aiidprod: {
            entities: [
                entity1,
                entity2,
            ],
            incidents: [
                incident1,
            ],
        }
    },
    testSingular: {
        allowed: [subscriber, admin],
        denied: [anonymous, editor],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: {
            _id: "60a7c5b7b4f5b8a6d8f9c7e4",
        }
    },
    testPluralFilter: {
        allowed: [subscriber, admin],
        denied: [anonymous, editor],
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
        allowed: [subscriber, admin],
        denied: [anonymous, editor],
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
    testUpdateOne: {
        allowed: [subscriber, admin],
        denied: [anonymous, editor],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        update: { set: { type: 'test' } },
        result: {
            _id: '60a7c5b7b4f5b8a6d8f9c7e4',
            type: 'test',
        }
    },
    testUpdateMany: null,
    testInsertOne: null,
    testInsertMany: null,
    testDeleteOne: null,
    testDeleteMany: {
        allowed: [subscriber, admin],
        denied: [anonymous, editor],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: { deletedCount: 1 },
    },
    testUpsertOne: {
        shouldInsert: {
            allowed: [subscriber, admin],
            denied: [anonymous, editor],
            result: {
                _id: expect.any(String),
                type: "entity",
                userId: { userId: subscriber.userId },
                entityId: { entity_id: entity1.entity_id },
            },
            update: {
                type: "entity",
                userId: { link: subscriber.userId },
                entityId: { link: entity1.entity_id },
            },
            filter: {
                userId: { EQ: subscriber.userId },
            },
        },
        shouldUpdate: {
            allowed: [subscriber, admin],
            denied: [anonymous],
            update: {
                type: "entity",
                userId: { link: subscriber.userId },
                entityId: { link: entity1.entity_id },
            },
            result: {
                _id: "60a7c5b7b4f5b8a6d8f9c7e4",
                type: 'entity',
                userId: { userId: subscriber.userId },
                entityId: { entity_id: entity1.entity_id },
            },
            filter: {
                userId: { EQ: subscriber.userId },
                type: { EQ: 'entity' },
                entityId: { EQ: entity1.entity_id },
            },
        }
    },
}

export default fixture;