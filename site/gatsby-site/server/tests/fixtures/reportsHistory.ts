import { ObjectId } from "bson";
import { Fixture } from "../utils";
import { History_Report, } from "../../generated/graphql";
import { DBReportHistory } from "../../interfaces";

const report1: DBReportHistory = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
    authors: ["Author 1", "Author 2"],
    cloudinary_id: "sample_cloudinary_id",
    date_downloaded: "2021-09-14T00:00:00.000Z",
    date_modified: "2021-09-14T00:00:00.000Z",
    date_published: "2021-09-14T00:00:00.000Z",
    date_submitted: "2021-09-14T00:00:00.000Z",
    description: "Sample description",
    editor_notes: "Sample editor notes",
    embedding: {
        from_text_hash: "sample_hash",
        vector: [0.1, 0.2, 0.3]
    },
    epoch_date_modified: 1631577600,
    epoch_date_published: 1631577600,
    epoch_date_submitted: 1631577600,
    flag: false,
    image_url: "http://example.com/image.png",
    inputs_outputs: ["input1", "output1"],
    is_incident_report: true,
    language: "en",
    plain_text: "Sample plain text",
    report_number: 1,
    source_domain: "example.com",
    submitters: ["Submitter 1", "Submitter 2"],
    tags: ["tag1", "tag2"],
    text: "Sample text",
    title: "Sample title",
    url: "http://example.com",
    user: "admin",
    quiet: false,
    modifiedBy: "admin",
}

const report2: DBReportHistory = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e9'),
    authors: ["Author 5", "Author 6"],
    cloudinary_id: "sample_cloudinary_id_3",
    date_downloaded: "2022-10-14T00:00:00.000Z",
    date_modified: "2022-10-14T00:00:00.000Z",
    date_published: "2022-10-14T00:00:00.000Z",
    date_submitted: "2022-10-14T00:00:00.000Z",
    description: "Another sample description",
    editor_notes: "Another sample editor notes",
    embedding: {
        from_text_hash: "sample_hash_3",
        vector: [0.7, 0.8, 0.9]
    },
    epoch_date_modified: 1665705600,
    epoch_date_published: 1665705600,
    epoch_date_submitted: 1665705600,
    flag: true,
    image_url: "http://example3.com/image3.png",
    inputs_outputs: ["input3", "output3"],
    is_incident_report: false,
    language: "es",
    plain_text: "Another sample plain text",
    report_number: 2,
    source_domain: "example3.com",
    submitters: ["Submitter 5", "Submitter 6"],
    tags: ["tag5", "tag6"],
    text: "Another sample text",
    title: "Another sample title",
    url: "http://example3.com",
    user: "admin",
    quiet: true,
    modifiedBy: "admin",
}

const report3: DBReportHistory = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7f4'),
    authors: ["Author 3", "Author 4"],
    cloudinary_id: "sample_cloudinary_id_2",
    date_downloaded: "2021-11-14T00:00:00.000Z",
    date_modified: "2021-11-14T00:00:00.000Z",
    date_published: "2021-11-14T00:00:00.000Z",
    date_submitted: "2021-11-14T00:00:00.000Z",
    description: "Third sample description",
    editor_notes: "Third sample editor notes",
    embedding: {
        from_text_hash: "sample_hash_2",
        vector: [0.4, 0.5, 0.6]
    },
    epoch_date_modified: 1636848000,
    epoch_date_published: 1636848000,
    epoch_date_submitted: 1636848000,
    flag: false,
    image_url: "http://example2.com/image2.png",
    inputs_outputs: ["input2", "output2"],
    is_incident_report: true,
    language: "fr",
    plain_text: "Third sample plain text",
    report_number: 3,
    source_domain: "example2.com",
    submitters: ["Submitter 3", "Submitter 4"],
    tags: ["tag3", "tag4"],
    text: "Third sample text",
    title: "Third sample title",
    url: "http://example2.com",
    user: "admin",
    quiet: false,
    modifiedBy: "admin",
}

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


const fixture: Fixture<History_Report, any, any> = {
    name: 'history_report',
    query: `
        _id
        authors
        cloudinary_id
        date_downloaded
        date_modified
        date_published
        date_submitted
        description
        editor_notes
        embedding {
            from_text_hash
            vector
        }
        epoch_date_modified
        epoch_date_published
        epoch_date_submitted
        flag
        image_url
        inputs_outputs
        is_incident_report
        language
        plain_text
        report_number
        source_domain
        submitters
        tags
        text
        title
        url
        user
        modifiedBy
        quiet
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                admin,
                anonymous,
            ],
        },
        history: {
            reports: [
                report1,
                report2,
                report3,
            ]
        }
    },
    testSingular: {
        allowed: [anonymous],
        denied: [],
        filter: { _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') } },
        result: {
            report_number: 1,
        }
    },
    testPluralFilter: {
        allowed: [anonymous],
        denied: [],
        filter: {
            _id: { EQ: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4') },
        },
        result: [
            { report_number: 1 },
        ]
    },
    testPluralSort: {
        allowed: [anonymous],
        denied: [],
        sort: { report_number: "ASC" },
        result: [
            { report_number: 1 },
            { report_number: 2 },
            { report_number: 3 },
        ],
    },
    testPluralPagination: {
        allowed: [anonymous],
        denied: [],
        pagination: { limit: 2, skip: 2 },
        sort: { report_number: "ASC" },
        result: [
            { report_number: 3 },
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