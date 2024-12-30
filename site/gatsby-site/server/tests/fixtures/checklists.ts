import { ObjectId } from 'bson';
import { Fixture } from "../utils";
import { Checklist, ChecklistInsertType } from "../../generated/graphql";

const checklist1 = {
    _id: new ObjectId("6537e59e9208f3f75b2db1f7"),
    owner_id: "60a7c5b7b4f5b8a6d8f9c7e6",
    tags_methods: ["GMF:Known AI Technology:Language Modeling"],
    tags_goals: ["GMF:Known AI Goal:Chatbot"],
    about: "",
    risks: [
        {
            id: "09511dbb-6bd8-42de-bc7b-bbac8864455b",
            tags: [
                "GMF:Known AI Technical Failure:Unsafe Exposure or Access"
            ],
            severity: "",
            title: "Unsafe Exposure or Access",
            risk_status: "Not Mitigated",
            likelihood: "",
            touched: false,
            risk_notes: ""
        }
    ],
    tags_other: ["CSETv1:Entertainment Industry:yes"],
    id: "849bd303-261f-4abe-8746-77dad5841dbe",
    name: "Test Checklist"
}

const checklist2 = {
    _id: new ObjectId("6537e59e9208f3f75b2db1f8"),
    owner_id: "63601cdc29e6840df23ad3e5",
    tags_methods: ["GMF:Known AI Technology:Transformer"],
    tags_goals: ["GMF:Known AI Goal:Chatbot"],
    about: "",
    risks: [
        {
            id: "09511dbb-6bd8-42de-bc7b-bbac8864455b",
            tags: [
                "GMF:Known AI Technical Failure:Unsafe Exposure or Access"
            ],
            severity: "",
            title: "Unsafe Exposure or Access",
            risk_status: "Not Mitigated",
            likelihood: "",
            touched: false,
            risk_notes: ""
        }
    ],
    tags_other: ["CSETv1:Entertainment Industry:yes"],
    id: "849bd303-261f-4abe-8746-77dad5841daa",
    name: "Test Checklist 2"
}

const subscriber = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    first_name: 'Subscriber',
    last_name: 'One',
    roles: ['subscriber'],
    userId: '60a7c5b7b4f5b8a6d8f9c7e6',
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

const fixture: Fixture<Checklist, any, ChecklistInsertType> = {
    name: 'checklists',
    query: `
        _id
        owner_id
        tags_methods
        tags_goals
        about
        risks {
            id
        }
        tags_other
        id
        name
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                admin,
                anonymous,
            ],
        },
        aiidprod: {
            checklists: [checklist1, checklist2]
        }
    },
    testSingular: {
        allowed: [anonymous, subscriber, admin],
        denied: [],
        filter: { _id: { EQ: new ObjectId("6537e59e9208f3f75b2db1f7") } },
        result: {
            id: "849bd303-261f-4abe-8746-77dad5841dbe",
            name: "Test Checklist",
        },
    },
    testPluralFilter: {
        allowed: [anonymous, subscriber, admin],
        denied: [],
        filter: {
            _id: { EQ: new ObjectId("6537e59e9208f3f75b2db1f7") },
        },
        result: [
            {
                id: "849bd303-261f-4abe-8746-77dad5841dbe",
                name: "Test Checklist",
            }
        ]
    },
    testPluralSort: {
        allowed: [anonymous, subscriber, admin],
        denied: [],
        sort: { name: "ASC" },
        result: [
            {
                name: "Test Checklist",
            },
            {
                name: "Test Checklist 2",
            },
        ],
    },
    testPluralPagination: {
        allowed: [subscriber],
        denied: [],
        pagination: { limit: 1, skip: 1 },
        sort: { name: "ASC" },
        result: [
            {
                name: "Test Checklist 2",
            },
        ]
    },
    testUpdateOne: null,
    testUpdateMany: null,
    testInsertOne: {
        allowed: [subscriber, admin, anonymous],
        denied: [],
        insert: {
            about: "Test Insert",
        },
        result: {
            _id: expect.any(String),
            about: "Test Insert",
        }
    },
    testInsertMany: null,
    testDeleteOne: {
        allowed: [admin, subscriber],
        denied: [anonymous],
        filter: { _id: { EQ: new ObjectId("6537e59e9208f3f75b2db1f7") } },
        result: {
            _id: "6537e59e9208f3f75b2db1f7",
        }
    },
    testDeleteMany: null,
    testUpsertOne: {
        shouldUpdate: {
            allowed: [admin, subscriber],
            denied: [anonymous],
            filter: { id: { EQ: "849bd303-261f-4abe-8746-77dad5841dbe" } },
            update: { name: 'Updated name' },
            result: { name: 'Updated name', _id: '6537e59e9208f3f75b2db1f7' }
        },
        shouldInsert: {
            allowed: [subscriber, admin, anonymous],
            denied: [],
            filter: { id: { EQ: "test" } },
            update: { name: 'New checklist', id: "test" },
            result: { name: 'New checklist', id: "test", _id: expect.any(String) }
        },
    },
}

export default fixture;