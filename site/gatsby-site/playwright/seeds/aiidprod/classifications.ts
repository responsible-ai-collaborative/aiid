import { ObjectId } from 'bson';
import { Classification } from '../../../server/generated/graphql'

type DBClassification = Omit<Classification, 'incidents' | 'reports'>
    & { incidents: number[] }
    & { reports: number[] }


const items: DBClassification[] = [
    {
        _id: new ObjectId("63f3d58c26ab981f33b3f9c7"),
        publish: true,
        reports: [],
        attributes: [
            {
                short_name: "Harm Distribution Basis",
                value_json: "[]"
            },
            {
                short_name: "Sector of Deployment",
                value_json: "[]"
            },
            {
                short_name: "Physical Objects",
                value_json: "\"no\""
            },
            {
                short_name: "Entertainment Industry",
                value_json: "\"no\""
            },
            {
                short_name: "Report, Test, or Study of data",
                value_json: "\"yes\""
            },
            {
                value_json: "\"no\"",
                short_name: "Deployed"
            },
            {
                short_name: "Producer Test in Controlled Conditions",
                value_json: "\"no\""
            },
            {
                short_name: "Producer Test in Operational Conditions",
                value_json: "\"no\""
            },
            {
                short_name: "User Test in Controlled Conditions",
                value_json: "\"\""
            },
            {
                value_json: "\"no\"",
                short_name: "User Test in Operational Conditions"
            },
            {
                short_name: "Harm Domain",
                value_json: "\"no\""
            },
            {
                short_name: "Tangible Harm",
                value_json: "\"yes\""
            },
            {
                short_name: "AI System",
                value_json: "\"yes\""
            },
            {
                short_name: "Clear link to technology",
                value_json: "\"no\""
            },
            {
                short_name: "There is a potentially identifiable specific entity that experienced the harm",
                value_json: "false"
            },
            {
                short_name: "AI Harm Level",
                value_json: "\"none\""
            },
            {
                short_name: "Impact on Critical Services",
                value_json: "\"no\""
            },
            {
                short_name: "Rights Violation",
                value_json: "\"yes\""
            },
            {
                short_name: "Involving Minor",
                value_json: "\"no\""
            },
            {
                short_name: "Detrimental Content",
                value_json: "\"\""
            },
            {
                short_name: "Protected Characteristic",
                value_json: "\"\""
            },
            {
                short_name: "Clear link to Technology",
                value_json: "\"\""
            },
            {
                short_name: "Harmed Class of Entities",
                value_json: "false"
            },
            {
                short_name: "Annotator’s AI special interest intangible harm assessment",
                value_json: "\"\""
            },
            {
                short_name: "Public Sector Deployment",
                value_json: "\"\""
            },
            {
                value_json: "\"\"",
                short_name: "Autonomy Level"
            },
            {
                value_json: "\"\"",
                short_name: "Intentional Harm"
            },
            {
                short_name: "AI tools and methods",
                value_json: "\"\""
            },
            {
                short_name: "Peer Reviewer",
                value_json: "\"\""
            },
            {
                short_name: "Quality Control",
                value_json: "false"
            },
            {
                short_name: "Annotation Status",
                value_json: "\"--\""
            },
            {
                short_name: "Incident Number",
                value_json: "0"
            },
            {
                short_name: "Annotator",
                value_json: "\"\""
            },
            {
                short_name: "AI Tangible Harm Level Notes",
                value_json: "\"\""
            },
            {
                short_name: "Notes (special interest intangible harm)",
                value_json: "\"\""
            },
            {
                short_name: "Special Interest Intangible Harm",
                value_json: "\"\""
            },
            {
                short_name: "Notes (AI special interest intangible harm)",
                value_json: "\"\""
            },
            {
                short_name: "Date of Incident Year",
                value_json: "\"\""
            },
            {
                short_name: "Date of Incident Month",
                value_json: "\"\""
            },
            {
                short_name: "Date of Incident Day",
                value_json: "\"\""
            },
            {
                value_json: "false",
                short_name: "Estimated Date"
            },
            {
                short_name: "Multiple AI Interaction",
                value_json: "\"\""
            },
            {
                value_json: "\"\"",
                short_name: "Embedded"
            },
            {
                short_name: "Location City",
                value_json: "\"\""
            },
            {
                short_name: "Location State/Province (two letters)",
                value_json: "\"\""
            },
            {
                value_json: "\"\"",
                short_name: "Location Country (two letters)"
            },
            {
                short_name: "Location Region",
                value_json: "\"Eastern and South-Eastern Asia\""
            },
            {
                short_name: "Infrastructure Sectors",
                value_json: "[]"
            },
            {
                short_name: "Operating Conditions",
                value_json: "\"\""
            },
            {
                short_name: "Notes (Environmental and Temporal Characteristics)",
                value_json: "\"\""
            },
            {
                short_name: "Entities",
                value_json: "[]"
            },
            {
                short_name: "Lives Lost",
                value_json: "0"
            },
            {
                short_name: "Injuries",
                value_json: "4"
            },
            {
                value_json: "false",
                short_name: "Estimated Harm Quantities"
            },
            {
                short_name: "Notes ( Tangible Harm Quantities Information)",
                value_json: "\"\""
            },
            {
                short_name: "AI System Description",
                value_json: "\"\""
            },
            {
                short_name: "Data Inputs",
                value_json: "[]"
            },
            {
                short_name: "Notes (Information about AI System)",
                value_json: "\"\""
            },
            {
                short_name: "Physical System Type",
                value_json: "\"\""
            },
            {
                short_name: "AI Task",
                value_json: "\"\""
            },
            {
                short_name: "Notes (AI Functionality and Techniques)",
                value_json: "\"\""
            }
        ],
        incidents: [3],
        namespace: "CSETv1",
        notes: "This is a test classification for Incident 3",

        // TODO: not in graphql schema but present on db
        // created_at: new Date( "1722269831340")
    },

    {
        _id: new ObjectId("63f3d58c26ab981f33b3f9c8"),
        publish: true,
        reports: [5],
        attributes: [
            {
                short_name: "Harm Distribution Basis",
                value_json: "[]"
            },
            {
                short_name: "Sector of Deployment",
                value_json: "[]"
            },
            {
                short_name: "Physical Objects",
                value_json: "\"\""
            },
            {
                short_name: "Entertainment Industry",
                value_json: "\"\""
            },
            {
                short_name: "Report, Test, or Study of data",
                value_json: "\"\""
            },
            {
                value_json: "\"\"",
                short_name: "Deployed"
            },
            {
                short_name: "Producer Test in Controlled Conditions",
                value_json: "\"\""
            },
            {
                short_name: "Producer Test in Operational Conditions",
                value_json: "\"\""
            },
            {
                short_name: "User Test in Controlled Conditions",
                value_json: "\"\""
            },
            {
                value_json: "\"\"",
                short_name: "User Test in Operational Conditions"
            },
            {
                short_name: "Harm Domain",
                value_json: "\"\""
            },
            {
                short_name: "Tangible Harm",
                value_json: "\"\""
            },
            {
                short_name: "AI System",
                value_json: "\"\""
            },
            {
                short_name: "Clear link to technology",
                value_json: "\"\""
            },
            {
                short_name: "There is a potentially identifiable specific entity that experienced the harm",
                value_json: "false"
            },
            {
                short_name: "AI Harm Level",
                value_json: "\"\""
            },
            {
                short_name: "Impact on Critical Services",
                value_json: "\"\""
            },
            {
                short_name: "Rights Violation",
                value_json: "\"\""
            },
            {
                short_name: "Involving Minor",
                value_json: "\"\""
            },
            {
                short_name: "Detrimental Content",
                value_json: "\"\""
            },
            {
                short_name: "Protected Characteristic",
                value_json: "\"\""
            },
            {
                short_name: "Clear link to Technology",
                value_json: "\"\""
            },
            {
                short_name: "Harmed Class of Entities",
                value_json: "false"
            },
            {
                short_name: "Annotator’s AI special interest intangible harm assessment",
                value_json: "\"\""
            },
            {
                short_name: "Public Sector Deployment",
                value_json: "\"\""
            },
            {
                value_json: "\"\"",
                short_name: "Autonomy Level"
            },
            {
                value_json: "\"\"",
                short_name: "Intentional Harm"
            },
            {
                short_name: "AI tools and methods",
                value_json: "\"\""
            },
            {
                short_name: "Peer Reviewer",
                value_json: "\"\""
            },
            {
                short_name: "Quality Control",
                value_json: "false"
            },
            {
                short_name: "Annotation Status",
                value_json: "\"--\""
            },
            {
                short_name: "Incident Number",
                value_json: "0"
            },
            {
                short_name: "Annotator",
                value_json: "\"\""
            },
            {
                short_name: "AI Tangible Harm Level Notes",
                value_json: "\"\""
            },
            {
                short_name: "Notes (special interest intangible harm)",
                value_json: "\"\""
            },
            {
                short_name: "Special Interest Intangible Harm",
                value_json: "\"\""
            },
            {
                short_name: "Notes (AI special interest intangible harm)",
                value_json: "\"\""
            },
            {
                short_name: "Date of Incident Year",
                value_json: "\"\""
            },
            {
                short_name: "Date of Incident Month",
                value_json: "\"\""
            },
            {
                short_name: "Date of Incident Day",
                value_json: "\"\""
            },
            {
                value_json: "false",
                short_name: "Estimated Date"
            },
            {
                short_name: "Multiple AI Interaction",
                value_json: "\"\""
            },
            {
                value_json: "\"\"",
                short_name: "Embedded"
            },
            {
                short_name: "Location City",
                value_json: "\"\""
            },
            {
                short_name: "Location State/Province (two letters)",
                value_json: "\"\""
            },
            {
                value_json: "\"\"",
                short_name: "Location Country (two letters)"
            },
            {
                short_name: "Location Region",
                value_json: "\"Eastern and South-Eastern Asia\""
            },
            {
                short_name: "Infrastructure Sectors",
                value_json: "[]"
            },
            {
                short_name: "Operating Conditions",
                value_json: "\"\""
            },
            {
                short_name: "Notes (Environmental and Temporal Characteristics)",
                value_json: "\"\""
            },
            {
                short_name: "Entities",
                value_json: "[]"
            },
            {
                short_name: "Lives Lost",
                value_json: "0"
            },
            {
                short_name: "Injuries",
                value_json: "4"
            },
            {
                value_json: "false",
                short_name: "Estimated Harm Quantities"
            },
            {
                short_name: "Notes ( Tangible Harm Quantities Information)",
                value_json: "\"\""
            },
            {
                short_name: "AI System Description",
                value_json: "\"\""
            },
            {
                short_name: "Data Inputs",
                value_json: "[]"
            },
            {
                short_name: "Notes (Information about AI System)",
                value_json: "\"\""
            },
            {
                short_name: "Physical System Type",
                value_json: "\"\""
            },
            {
                short_name: "AI Task",
                value_json: "\"\""
            },
            {
                short_name: "Notes (AI Functionality and Techniques)",
                value_json: "\"\""
            }
        ],
        incidents: [],
        namespace: "CSETv1",
        notes: "This is a test classification for Report 5",

        // TODO: not in graphql schema but present on db
        // created_at: new Date( "1722269831340")
    },

    {
        "_id": new ObjectId("64bf3898da1ddcde072ec094"),
        "notes": "",
        "publish": true,
        "reports": [],
        "attributes": [
            {
                "short_name": "Harm Distribution Basis",
                "value_json": "[\"race\",\"sex\"]"
            },
            {
                "short_name": "Sector of Deployment",
                "value_json": "[\"information and communication\"]"
            },
            {
                "short_name": "Physical Objects",
                "value_json": "\"no\""
            },
            {
                "short_name": "Entertainment Industry",
                "value_json": "\"no\""
            },
            {
                "short_name": "Report, Test, or Study of data",
                "value_json": "\"no\""
            },
            {
                "short_name": "Deployed",
                "value_json": "\"yes\""
            },
            {
                "short_name": "Producer Test in Controlled Conditions",
                "value_json": "\"no\""
            },
            {
                "short_name": "Producer Test in Operational Conditions",
                "value_json": "\"no\""
            },
            {
                "short_name": "User Test in Controlled Conditions",
                "value_json": "\"no\""
            },
            {
                "short_name": "User Test in Operational Conditions",
                "value_json": "\"no\""
            },
            {
                "short_name": "Harm Domain",
                "value_json": "\"yes\""
            },
            {
                "short_name": "Tangible Harm",
                "value_json": "\"no tangible harm, near-miss, or issue\""
            },
            {
                "value_json": "\"yes\"",
                "short_name": "AI System"
            },
            {
                "short_name": "Clear link to technology",
                "value_json": "\"yes\""
            },
            {
                "short_name": "There is a potentially identifiable specific entity that experienced the harm",
                "value_json": "false"
            },
            {
                "short_name": "AI Harm Level",
                "value_json": "\"none\""
            },
            {
                "short_name": "Impact on Critical Services",
                "value_json": "\"no\""
            },
            {
                "value_json": "\"no\"",
                "short_name": "Rights Violation"
            },
            {
                "short_name": "Involving Minor",
                "value_json": "\"no\""
            },
            {
                "value_json": "\"no\"",
                "short_name": "Detrimental Content"
            },
            {
                "value_json": "\"yes\"",
                "short_name": "Protected Characteristic"
            },
            {
                "short_name": "Clear link to Technology",
                "value_json": "\"yes\""
            },
            {
                "short_name": "Harmed Class of Entities",
                "value_json": "true"
            },
            {
                "short_name": "Annotator’s AI special interest intangible harm assessment",
                "value_json": "\"yes\""
            },
            {
                "short_name": "Public Sector Deployment",
                "value_json": "\"no\""
            },
            {
                "short_name": "Autonomy Level",
                "value_json": "\"Autonomy1\""
            },
            {
                "short_name": "Intentional Harm",
                "value_json": "\"No. Not intentionally designed to perform harm\""
            },
            {
                "value_json": "[]",
                "short_name": "AI tools and methods"
            },
            {
                "short_name": "Peer Reviewer",
                "value_json": "\"002\""
            },
            {
                "short_name": "Quality Control",
                "value_json": "false"
            },
            {
                "value_json": "\"4. Peer review complete\"",
                "short_name": "Annotation Status"
            },
            {
                "value_json": "2",
                "short_name": "Incident Number"
            },
            {
                "short_name": "Annotator",
                "value_json": "\"005\""
            },
            {
                "short_name": "AI Tangible Harm Level Notes",
                "value_json": "\"\""
            },
            {
                "short_name": "Notes (special interest intangible harm)",
                "value_json": "\"\""
            },
            {
                "short_name": "Special Interest Intangible Harm",
                "value_json": "\"yes\""
            },
            {
                "short_name": "Notes (AI special interest intangible harm)",
                "value_json": "\"\""
            },
            {
                "short_name": "Date of Incident Year",
                "value_json": "\"2012\""
            },
            {
                "short_name": "Date of Incident Month",
                "value_json": "\"04\""
            },
            {
                "short_name": "Date of Incident Day",
                "value_json": "\"\""
            },
            {
                "value_json": "true",
                "short_name": "Estimated Date"
            },
            {
                "short_name": "Multiple AI Interaction",
                "value_json": "\"no\""
            },
            {
                "short_name": "Embedded",
                "value_json": "\"no\""
            },
            {
                "short_name": "Location City",
                "value_json": "\"\""
            },
            {
                "short_name": "Location State/Province (two letters)",
                "value_json": "\"\""
            },
            {
                "short_name": "Location Country (two letters)",
                "value_json": "\"\""
            },
            {
                "short_name": "Location Region",
                "value_json": "\"Global\""
            },
            {
                "value_json": "[]",
                "short_name": "Infrastructure Sectors"
            },
            {
                "short_name": "Operating Conditions",
                "value_json": "\"\""
            },
            {
                "short_name": "Notes (Environmental and Temporal Characteristics)",
                "value_json": "\"\""
            },
            {
                "short_name": "Entities",
                "value_json": "[{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Kabir Alli\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"true\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"individual\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"user\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"AI special interest intangible harm\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"disproportionate treatment based upon a protected characteristic\\\"\"}]},{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Black teenagers\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"false\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"group of individuals\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"affected non-users\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"AI special interest intangible harm\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"disproportionate treatment based upon a protected characteristic\\\"\"}]},{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Google\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"true\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"for-profit organization\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"developer\\\",\\\"deployer\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"not applicable\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"not applicable\\\"\"}]},{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Google Search\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"true\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"product\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"product containing AI\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"not applicable\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"not applicable\\\"\"}]},{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Women of color\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"false\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"group of individuals\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"user\\\",\\\"affected non-user\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"AI special interest intangible harm\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"disproportionate treatment based upon a protected characteristic\\\"\"}]}]"
            },
            {
                "short_name": "Lives Lost",
                "value_json": "0"
            },
            {
                "value_json": "0",
                "short_name": "Injuries"
            },
            {
                "short_name": "Estimated Harm Quantities",
                "value_json": "false"
            },
            {
                "short_name": "Notes ( Tangible Harm Quantities Information)",
                "value_json": "\"\""
            },
            {
                "short_name": "AI System Description",
                "value_json": "\"Search engine and content ranking system. \""
            },
            {
                "short_name": "Data Inputs",
                "value_json": "[\"images\",\"image alt tags\",\"text\"]"
            },
            {
                "short_name": "Notes (Information about AI System)",
                "value_json": "\"\""
            },
            {
                "short_name": "Physical System Type",
                "value_json": "\"\""
            },
            {
                "short_name": "AI Task",
                "value_json": "[\"search engine optimization\"]"
            },
            {
                "value_json": "\"\"",
                "short_name": "Notes (AI Functionality and Techniques)"
            }
        ],
        "incidents": [2],
        "namespace": "CSETv1_Annotator-1",
    },

    {
        "_id": new ObjectId("6503a32f8361de7a3732d36f"),
        "attributes": [
            {
                "short_name": "Harm Distribution Basis",
                "value_json": "[\"sex\",\"race\"]"
            },
            {
                "short_name": "Sector of Deployment",
                "value_json": "[\"information and communication\"]"
            },
            {
                "value_json": "\"maybe\"",
                "short_name": "Physical Objects"
            },
            {
                "short_name": "Entertainment Industry",
                "value_json": "\"no\""
            },
            {
                "value_json": "\"no\"",
                "short_name": "Report, Test, or Study of data"
            },
            {
                "short_name": "Deployed",
                "value_json": "\"yes\""
            },
            {
                "value_json": "\"no\"",
                "short_name": "Producer Test in Controlled Conditions"
            },
            {
                "short_name": "Producer Test in Operational Conditions",
                "value_json": "\"no\""
            },
            {
                "short_name": "User Test in Controlled Conditions",
                "value_json": "\"no\""
            },
            {
                "short_name": "User Test in Operational Conditions",
                "value_json": "\"no\""
            },
            {
                "short_name": "Harm Domain",
                "value_json": "\"yes\""
            },
            {
                "short_name": "Tangible Harm",
                "value_json": "\"no tangible harm, near-miss, or issue\""
            },
            {
                "short_name": "AI System",
                "value_json": "\"yes\""
            },
            {
                "short_name": "Clear link to technology",
                "value_json": "\"yes\""
            },
            {
                "short_name": "There is a potentially identifiable specific entity that experienced the harm",
                "value_json": "false"
            },
            {
                "short_name": "AI Harm Level",
                "value_json": "\"none\""
            },
            {
                "short_name": "Impact on Critical Services",
                "value_json": "\"no\""
            },
            {
                "short_name": "Rights Violation",
                "value_json": "\"no\""
            },
            {
                "short_name": "Involving Minor",
                "value_json": "\"no\""
            },
            {
                "short_name": "Detrimental Content",
                "value_json": "\"no\""
            },
            {
                "short_name": "Protected Characteristic",
                "value_json": "\"yes\""
            },
            {
                "value_json": "\"yes\"",
                "short_name": "Clear link to Technology"
            },
            {
                "short_name": "Harmed Class of Entities",
                "value_json": "true"
            },
            {
                "short_name": "Annotator’s AI special interest intangible harm assessment",
                "value_json": "\"yes\""
            },
            {
                "short_name": "Public Sector Deployment",
                "value_json": "\"no\""
            },
            {
                "value_json": "\"Autonomy1\"",
                "short_name": "Autonomy Level"
            },
            {
                "short_name": "Intentional Harm",
                "value_json": "\"No. Not intentionally designed to perform harm\""
            },
            {
                "short_name": "AI tools and methods",
                "value_json": "\"\""
            },
            {
                "short_name": "Peer Reviewer",
                "value_json": "\"002\""
            },
            {
                "short_name": "Quality Control",
                "value_json": "false"
            },
            {
                "value_json": "\"4. Peer review complete\"",
                "short_name": "Annotation Status"
            },
            {
                "short_name": "Incident Number",
                "value_json": "2"
            },
            {
                "short_name": "Annotator",
                "value_json": "\"001\""
            },
            {
                "value_json": "\"\"",
                "short_name": "AI Tangible Harm Level Notes"
            },
            {
                "short_name": "Notes (special interest intangible harm)",
                "value_json": "\"Propagation of systemic racial bias by Google search \""
            },
            {
                "value_json": "\"yes\"",
                "short_name": "Special Interest Intangible Harm"
            },
            {
                "value_json": "\"\"",
                "short_name": "Notes (AI special interest intangible harm)"
            },
            {
                "short_name": "Date of Incident Year",
                "value_json": "\"2012\""
            },
            {
                "short_name": "Date of Incident Month",
                "value_json": "\"\""
            },
            {
                "short_name": "Date of Incident Day",
                "value_json": "\"\""
            },
            {
                "short_name": "Estimated Date",
                "value_json": "true"
            },
            {
                "value_json": "\"no\"",
                "short_name": "Multiple AI Interaction"
            },
            {
                "short_name": "Embedded",
                "value_json": "\"no\""
            },
            {
                "short_name": "Location City",
                "value_json": "\"\""
            },
            {
                "short_name": "Location State/Province (two letters)",
                "value_json": "\"\""
            },
            {
                "short_name": "Location Country (two letters)",
                "value_json": "\"\""
            },
            {
                "short_name": "Location Region",
                "value_json": "\"Global\""
            },
            {
                "short_name": "Infrastructure Sectors",
                "value_json": "[]"
            },
            {
                "short_name": "Operating Conditions",
                "value_json": "\"\""
            },
            {
                "value_json": "\"\"",
                "short_name": "Notes (Environmental and Temporal Characteristics)"
            },
            {
                "short_name": "Entities",
                "value_json": "[{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Google\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"true\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"for-profit organization\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"developer\\\",\\\"deployer\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"not applicable\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"not applicable\\\"\"}]},{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Google Search\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"true\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"product\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"AI\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"not applicable\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"not applicable\\\"\"}]},{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Black people\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"false\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"group of individuals\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"user\\\",\\\"affected non-user\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"AI special interest intangible harm\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"disproportionate treatment based upon a protected characteristic\\\"\"}]},{\"attributes\":[{\"short_name\":\"Entity\",\"value_json\":\"\\\"Women of color\\\"\"},{\"short_name\":\"Named Entity\",\"value_json\":\"false\"},{\"short_name\":\"Entity type\",\"value_json\":\"\\\"group of individuals\\\"\"},{\"short_name\":\"Entity Relationship to the AI\",\"value_json\":\"[\\\"user\\\",\\\"affected non-user\\\"]\"},{\"short_name\":\"Harm Category Experienced\",\"value_json\":\"\\\"AI special interest intangible harm\\\"\"},{\"short_name\":\"Harm Type Experienced\",\"value_json\":\"\\\"disproportionate treatment based upon a protected characteristic\\\"\"}]}]"
            },
            {
                "value_json": "0",
                "short_name": "Lives Lost"
            },
            {
                "short_name": "Injuries",
                "value_json": "0"
            },
            {
                "short_name": "Estimated Harm Quantities",
                "value_json": "false"
            },
            {
                "short_name": "Notes ( Tangible Harm Quantities Information)",
                "value_json": "\"\""
            },
            {
                "short_name": "AI System Description",
                "value_json": "\"Search engine\""
            },
            {
                "value_json": "[\"Text\"]",
                "short_name": "Data Inputs"
            },
            {
                "value_json": "\"\"",
                "short_name": "Notes (Information about AI System)"
            },
            {
                "short_name": "Physical System Type",
                "value_json": "\"\""
            },
            {
                "value_json": "[\"search engine\"]",
                "short_name": "AI Task"
            },
            {
                "short_name": "Notes (AI Functionality and Techniques)",
                "value_json": "\"\""
            }
        ],
        "incidents": [2],
        "namespace": "CSETv1_Annotator-2",
        "notes": "",
        "publish": true,
        "reports": [],
    },

    {
        namespace: "GMF",
        publish: true,
        notes: "",
        attributes: [
            {
                short_name: "Known AI Goal",
                value_json: "[\"Question Answering\"]"
            },
            {
                short_name: "Known AI Goal Snippets",
                value_json: "[{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"You can pose any question you like and be sure to receive an answer, wrapped in the authority of the algorithm rather than the soothsayer.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Question Answering\\\"]\"}]}]"
            },
            {
                short_name: "Known AI Technology",
                value_json: "[\"Distributional Learning\",\"Language Modeling\"]"
            },
            {
                short_name: "Known AI Technology Snippets",
                value_json: "[{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\" It has clear biases, telling you that America is “good” and that Somalia is “dangerous”; and it’s amenable to special pleading, noting that eating babies is “okay” as long as you are “really, really hungry.”\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Distributional Learning\\\"]\"}]},{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"You can pose any question you like and be sure to receive an answer, wrapped in the authority of the algorithm rather than the soothsayer.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Language Modeling\\\"]\"}]}]"
            },
            {
                short_name: "Potential AI Technology",
                value_json: "[\"Transformer\"]"
            },
            {
                short_name: "Potential AI Technology Snippets",
                value_json: "[{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"You can pose any question you like and be sure to receive an answer, wrapped in the authority of the algorithm rather than the soothsayer.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Transformer\\\"]\"}]}]"
            },
            {
                short_name: "Known AI Technical Failure",
                value_json: "[\"Distributional Bias\",\"Gaming Vulnerability\"]"
            },
            {
                short_name: "Known AI Technical Failure Snippets",
                value_json: "[{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"Ask Delphi is no different in this regard, and its training data incorporates some unusual sources, including a series of one-sentence prompts scraped from two subreddits: r/AmITheAsshole and r/Confessions.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Distributional Bias\\\"]\"}]},{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\" It has clear biases, telling you that America is “good” and that Somalia is “dangerous”; and it’s amenable to special pleading, noting that eating babies is “okay” as long as you are “really, really hungry.”\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Distributional Bias\\\"]\"}]},{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"Most of Ask Delphi’s judgements, though, aren’t so much ethically wrong as they are obviously influenced by their framing. Even very small changes to how you pose a particular quandary can flip the system’s judgement from condemnation to approval.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Gaming Vulnerability\\\"]\"}]}]"
            },
            {
                short_name: "Potential AI Technical Failure",
                value_json: "[\"Overfitting\",\"Robustness Failure\",\"Context Misidentification\",\"Limited Dataset\"]"
            },
            {
                short_name: "Potential AI Technical Failure Snippets",
                value_json: "[{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"Sometimes it’s obvious how to tip the scales. For example, the AI will tell you that “drunk driving” is wrong but that “having a few beers while driving because it hurts no-one” is a-okay. If you add the phrase “if it makes everyone happy” to the end of your statement, then the AI will smile beneficently on any immoral activity of your choice, up to and including genocide. Similarly, if you add “without apologizing” to the end of many benign descriptions, like “standing still” or “making pancakes,” it will assume you should have apologized and tells you that you’re being rude. Ask Delphi is a creature of context.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Overfitting\\\",\\\"Context Misidentification\\\"]\"}]},{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"Most of Ask Delphi’s judgements, though, aren’t so much ethically wrong as they are obviously influenced by their framing. Even very small changes to how you pose a particular quandary can flip the system’s judgement from condemnation to approval.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Overfitting\\\",\\\"Robustness Failure\\\"]\"}]},{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"Others found the system woefully inconsistent, illogical and offensive. \\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Robustness Failure\\\"]\"}]},{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"The folks behind the project drew on some eyebrow-raising sources to help train the AI, including the “Am I the Asshole?” subreddit, the “Confessions” subreddit, and the “Dear Abby” advice column, according to the paper the team behind Delphi published about the experiment.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Limited Dataset\\\"]\"}]},{\"attributes\":[{\"short_name\":\"Snippet Text\",\"value_json\":\"\\\"Ask Delphi is no different in this regard, and its training data incorporates some unusual sources, including a series of one-sentence prompts scraped from two subreddits: r/AmITheAsshole and r/Confessions.\\\"\"},{\"short_name\":\"Related Classifications\",\"value_json\":\"[\\\"Limited Dataset\\\"]\"}]}]"
            },
            {
                short_name: "Potential AI Technical Failure Classification Discussion",
                value_json: "\"Limited Dataset: US ethics only, data sourced from two subreddits and a column.\""
            }
        ],
        incidents: [
            1,
        ],
        reports: [],
    },
]

export default items;