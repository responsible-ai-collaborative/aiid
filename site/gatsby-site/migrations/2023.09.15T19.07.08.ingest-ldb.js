const config = require('../config');
const { parse } = require('csv-parse/sync');
const { el } = require('date-fns/locale');
const fs = require('fs');
const path = require('path');
const { format, getUnixTime } = require('date-fns');


function loadTable(name,) {
    const csvPath = path.join(__dirname, 'assets', name);
    const csvData = fs.readFileSync(csvPath);

    const results = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
    });

    return results;
}

const namespace = 'AILD';

const taxonomyDefinition = {
    namespace,
    field_list: [
        {
            short_name: 'Record Number',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'int',
            mongo_type: 'int',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Caption',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'text',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Brief Description',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'text',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Area of Application List',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'list',
            mongo_type: 'array',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Cause of Action List',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'list',
            mongo_type: 'array',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Issue List',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'list',
            mongo_type: 'array',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Name of Algorithm List',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'list',
            mongo_type: 'array',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Class Action List',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'list',
            mongo_type: 'array',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Organizations involved',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'list',
            mongo_type: 'array',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Jurisdiction Filed',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'string',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Date Action Filed',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'date',
            mongo_type: 'date',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Published Opinions',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'bool',
            mongo_type: 'bool',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Status Disposition',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'multi',
            mongo_type: 'array',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Date Added',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'date',
            mongo_type: 'date',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Last Update',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'date',
            mongo_type: 'date',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Progress Notes',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'text',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Researcher',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'text',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Summary of Significance',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'text',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Summary Facts Activity to Date',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'text',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Most Recent Activity',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'text',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Most Recent Activity Date',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'date',
            mongo_type: 'date',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
        {
            short_name: 'Keyword',
            long_name: '',
            short_description: '',
            long_description: '',
            display_type: 'text',
            mongo_type: 'string',
            complete_from: {},
            default: '',
            placeholder: '',
            permitted_values: [],
            weight: 50,
            instant_facet: false,
            required: false,
            public: true,
        },
    ]
}

const attributesMap = {
    'Record_Number': 'Record Number',
    'Caption': 'Caption',
    'Brief_Description': 'Brief Description',
    'Area_of_Application_List': 'Area of Application List',
    'Cause_of_Action_List': 'Cause of Action List',
    'Issue_List': 'Issue List',
    'Name_of_Algorithm_List': 'Name of Algorithm List',
    'Class_Action_list': 'Class Action List',
    'Organizations_involved': 'Organizations involved',
    'Jurisdiction_Filed': 'Jurisdiction Filed',
    'Date_Action_Filed': 'Date Action Filed',
    'Published_Opinions': 'Published Opinions',
    'Status_Disposition': 'Status Disposition',
    'Date_Added': 'Date Added',
    'Last_Update': 'Last Update',
    'Progress_Notes': 'Progress Notes',
    'Researcher': 'Researcher',
    'Summary_of_Significance': 'Summary of Significance',
    'Summary_Facts_Activity_to_Date': 'Summary Facts Activity to Date',
    'Most_Recent_Activity': 'Most Recent Activity',
    'Most_Recent_Activity_Date': 'Most Recent Activity Date',
    'Keyword': 'Keyword',
}

const columnFilter = (key) => {
    if (attributesMap[key]) {
        return true;
    }

    console.log('Skiping attribute', key);

    return false;
}

const columnToClassificationAttribute = (column, value) => {

    const short_name = attributesMap[column];

    const definition = taxonomyDefinition.field_list.find(f => f.short_name == short_name);

    let parsedValue = null;

    switch (definition.display_type) {

        case 'date': parsedValue = new Date(value); break;

        case 'int': parsedValue = parseInt(value); break;

        case 'string':
        case 'text': parsedValue = value; break;

        case 'multi':
        case 'list': parsedValue = value.split(",").map(item => item.trim().replace(/'/g, "")); break;

        case 'bool': parsedValue = value == 'Yes'; break;

        default: throw new Error('unknown display type' + definition.display_type);
    }

    return {
        short_name,
        value_json: JSON.stringify(parsedValue),
    }
}
/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
    await client.connect();

    const classificationsCollection = client
        .db(config.realm.production_db.db_name)
        .collection('classifications');

    const reportsCollection = client
        .db(config.realm.production_db.db_name)
        .collection('reports');

    // main table
    const allCases = loadTable('Case_Table_2023-Aug-07_1439.csv');

    // only need to load these csvs, because the others are already denormalized
    const allDockets = loadTable('Docket_Table_2023-Aug-07_1439.csv');
    const allDocuments = loadTable('Document_Table_2023-Aug-07_1439.csv');
    const allSecondarySources = loadTable('Secondary_Source_Coverage_Table_2023-Aug-07_1439.csv');

    for (const caseItem of allCases) {

        const dockets = allDockets.filter(d => d.Case_Number == caseItem.Record_Number);
        const documents = allDocuments.filter(d => d.Case_Number == caseItem.Record_Number);
        const secondarySources = allSecondarySources.filter(d => d.Case_Number == caseItem.Record_Number);

        const [latestReport] = await reportsCollection
            .find({}, { projection: { report_number: 1 } })
            .sort({ report_number: -1 })
            .limit(1)
            .toArray();

        const report_number = latestReport.report_number + 1;

        const date = new Date();

        const report = {
            report_number,
            title: caseItem.Caption,
            description: caseItem.Brief_Description,
            text: caseItem.Keyword,
            plain_text: caseItem.Keyword,
            is_incident_report: false,
            authors: [],
            url: '',
            source_domain: '',
            cloudinary_id: '',
            date_downloaded: format(date, 'yyyy-MM-dd'),
            date_modified: format(date, 'yyyy-MM-dd'),
            date_published: format(date, 'yyyy-MM-dd'),
            date_submitted: format(date, 'yyyy-MM-dd'),
            epoch_date_downloaded: getUnixTime(date),
            epoch_date_modified: getUnixTime(date),
            epoch_date_published: getUnixTime(date),
            epoch_date_submitted: getUnixTime(date),
            image_url: "",
            language: "",
            submitters: [],
            tags: [],
        }

        const reportResult = await reportsCollection.insertOne(report);

        console.log('Inserted report', reportResult.insertedId)


        const attributes = Object.keys(caseItem)
            .filter(columnFilter)
            .map((key) => columnToClassificationAttribute(key, caseItem[key]));

        const classification = {
            attributes,
            incidents: [],
            reports: [report_number],
            namespace,
            notes: '',
            publish: true,
        }

        const classificationResult = await classificationsCollection.insertOne(classification);

        console.log('Inserted classification', classificationResult.insertedId);
    }




};
