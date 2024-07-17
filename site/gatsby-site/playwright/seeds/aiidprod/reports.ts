import { Report } from '../../../server/generated/graphql'

type DBReport = Omit<Report, 'user'>
    & { user: string }

const items: DBReport[] = [
    {
        report_number: 1,
        title: "Report 1",
        authors: ["author1"],
        cloudinary_id: "cloudinary_id1",
        date_downloaded: "2020-01-01",
        date_modified: "2020-01-01",
        date_published: "2020-01-01",
        date_submitted: "2020-01-01",
        epoch_date_downloaded: 1577836800,
        epoch_date_modified: 1577836800,
        epoch_date_published: 1577836800,
        epoch_date_submitted: 1577836800,
        image_url: "image_url1",
        language: "en",
        plain_text: "plain_text1",
        text: "text1",
        source_domain: "source_domain1",
        submitters: ["submitter1"],
        tags: ["tag1"],
        url: "url1",
        user: "user1",
    },
    {
        title: "Issue Report",
        authors: ["author2"],
        report_number: 3,
        is_incident_report: true,

        cloudinary_id: "cloudinary_id1",

        date_downloaded: "2020-01-01",
        date_modified: "2020-01-01",
        date_published: "2020-01-01",
        date_submitted: "2020-01-01",
        epoch_date_downloaded: 1577836800,
        epoch_date_modified: 1577836800,
        epoch_date_published: 1577836800,
        epoch_date_submitted: 1577836800,

        image_url: "image_url1",
        language: "en",
        plain_text: "plain_text1",
        text: "text1",
        source_domain: "source_domain1",
        submitters: ["submitter1"],
        tags: ["tag1"],
        url: "url1",
        user: "user1",
    }
]

export default items;