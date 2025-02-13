import { ObjectId } from 'bson';

const checklists = [
    {
        _id: new ObjectId("6537e59e9208f3f75b2db1f7"),
        owner_id: "63601cdc29e6840df23ad3e5",
        tags_methods: [
            "GMF:Known AI Technology:Language Modeling"
        ],
        tags_goals: [
            "GMF:Known AI Goal:Chatbot"
        ],
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
        tags_other: [
            "CSETv1:Entertainment Industry:yes"
        ],
        id: "849bd303-261f-4abe-8746-77dad5841dbe",
        name: "Test Checklist"
    }
]

export default checklists;