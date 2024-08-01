import { Classification } from '../../../server/generated/graphql'

type DBClassification = Omit<Classification, 'incidents' | 'reports'>
    & { incidents: number[] }
    & { reports: number[] }


const items: DBClassification[] = [
    {
        _id: "63f3d58c26ab981f33b3f9c7",
        publish: false,
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
                value_json: "0"
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
        incidents: [
            3
        ],
        namespace: "CSETv1",
        notes: "",

        // TODO: not in graphql schema but present on db
        // created_at: new Date( "1722269831340")
    }
]

export default items;