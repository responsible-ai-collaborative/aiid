import { Report } from '../../../server/generated/graphql'

type DBReport = Omit<Report, 'user'>
    & { user: string }

const items: DBReport[] = [
    {
        report_number: 1,
        title: "Report 1",
        authors: ["author1"],
        cloudinary_id: "cloudinary_id1",
        date_downloaded: new Date("2020-01-01"),
        date_modified: new Date("2020-01-01"),
        date_published: new Date("2020-01-01"),
        date_submitted: new Date("2020-01-01"),
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
        url: "https://report1.com",
        user: "user1",
    },
    {
        title: "Report 2",
        authors: ["author2"],
        report_number: 2,
        is_incident_report: true,

        cloudinary_id: "cloudinary_id1",

        date_downloaded: new Date("2020-01-01"),
        date_modified: new Date("2020-01-01"),
        date_published: new Date("2020-01-01"),
        date_submitted: new Date("2020-01-01"),
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
        url: "https://report2.com",
        user: "user1",
    },
    {
        _id: "5d34b8c29ced494f010ed469",
        authors: ["Jodi Kantor"],
        date_downloaded: new Date(1555113600000),
        date_modified: new Date(1592092800000),
        date_published: new Date(1407974400000),
        date_submitted: new Date(1559347200000),
        description: "Increasing numbers of low-income mothers and fathers are at the center of a new collision that pits workplace scheduling technology against the routines of parenting.",
        epoch_date_downloaded: 1555113600,
        epoch_date_modified: 1592092800,
        epoch_date_published: 1407974400,
        epoch_date_submitted: 1559347200,
        image_url: "https://static01.nyt.com/images/2014/08/13/us/worker-hours-1407960684740/worker-hours-1407960684740-articleLarge.jpg",
        language: "en",
        report_number: 3,
        source_domain: "nytimes.com",
        submitters: [
            "Catherine Olsson"
        ],
        text: "SAN DIEGO — In a typical last-minute scramble, Jannette Navarro, a Starbucks barista and single mother",
        title: "Working Anything but 9 to 5",
        url: "https://www.nytimes.com/interactive/2014/08/13/us/starbucks-workers-scheduling-hours.html",
        tags: ['Test Tag'],
        plain_text: "SAN DIEGO — In a typical last-minute scramble, Jannette Navarro, a Starbucks barista and single mother",
        editor_notes: "",
        cloudinary_id: "reports/static01.nyt.com/images/2014/08/13/us/worker-hours-1407960684740/worker-hours-1407960684740-articleLarge.jpg",
        embedding: {
            vector: [
                -0.05127561464905739,
                0.09822321683168411
            ],
            from_text_hash: "58d19321422d4f58113d45d7e15f1962078237c7"
        },
        is_incident_report: true,

        // TODO: this report (16) has no user in the database but is the user field  is required by the schema
        user: 'user1',

        // TODO: field is present in the db but not mapped to any graphql field
        // created_at: 1559347200000
    },
    {
        authors: [
            "News Writer"
        ],
        date_downloaded: new Date(1555113600000),
        date_modified: new Date(1592092800000),
        date_published: new Date(1440633600000),
        date_submitted: new Date(1559347200000),
        description: "Retail and restaurant workers are the focus of a raging national debate over fair hours, pay and the use of shift scheduling software from big vendors such as ADP, SAP and Kronos.",
        epoch_date_downloaded: 1555113600,
        epoch_date_modified: 1592092800,
        epoch_date_published: 1440633600,
        epoch_date_submitted: 1559347200,
        image_url: "https://cdn.ttgtmedia.com/visuals/searchFinancialApplications/hr_technology/financialapplications_article_004.jpg",
        language: "en",
        report_number: 4,
        source_domain: "searchhrsoftware.techtarget.com",
        submitters: [
            "Catherine Olsson"
        ],
        text: "Caitlin O'Reilly-Green, a barista at an Atlanta Starbucks",
        title: "Kronos shift scheduling software a grind for Starbucks worker",
        url: "https://searchhrsoftware.techtarget.com/news/4500252451/Kronos-shift-scheduling-software-a-grind-for-Starbucks-worker",
        tags: [],
        plain_text: "Caitlin O'Reilly-Green, a barista at an Atlanta Starbucks",
        editor_notes: "",
        cloudinary_id: "reports/cdn.ttgtmedia.com/visuals/searchFinancialApplications/hr_technology/financialapplications_article_004.jpg",
        embedding: {
            vector: [
                -0.09370243549346924,
                0.10497249662876129
            ],
            from_text_hash: "6dfba3c22a24c31e017dfbe8594e312cc127cb38"
        },
        is_incident_report: true,

        // TODO: ditto
        user: 'user1',

        // TODO: ditto
        // created_at: 1559347200000
    },
    {
        authors: [
            "News Writer"
        ],
        date_downloaded: new Date(1555113600000),
        date_modified: new Date(1592092800000),
        date_published: new Date(1440633600000),
        date_submitted: new Date(1559347200000),
        description: "Retail and restaurant workers are the focus of a raging national debate over fair hours, pay and the use of shift scheduling software from big vendors such as ADP, SAP and Kronos.",
        epoch_date_downloaded: 1555113600,
        epoch_date_modified: 1592092800,
        epoch_date_published: 1440633600,
        epoch_date_submitted: 1559347200,
        image_url: "https://cdn.ttgtmedia.com/visuals/searchFinancialApplications/hr_technology/financialapplications_article_004.jpg",
        language: "en",
        report_number: 5,
        source_domain: "searchhrsoftware.techtarget.com",
        submitters: [
            "Catherine Olsson"
        ],
        text: "Caitlin O'Reilly-Green, a barista at an Atlanta Starbucks",
        title: "Issue Report 5",
        url: "https://searchhrsoftware.techtarget.com/news/4500252451/Kronos-shift-scheduling-software-a-grind-for-Starbucks-worker",
        tags: [],
        plain_text: "Caitlin O'Reilly-Green, a barista at an Atlanta Starbucks",
        editor_notes: "",
        cloudinary_id: "reports/cdn.ttgtmedia.com/visuals/searchFinancialApplications/hr_technology/financialapplications_article_004.jpg",
        embedding: {
            vector: [
                -0.09370243549346924,
                0.10497249662876129
            ],
            from_text_hash: "6dfba3c22a24c31e017dfbe8594e312cc127cb38"
        },
        is_incident_report: false,

        // TODO: ditto
        user: 'user1',

        // TODO: ditto
        // created_at: 1559347200000
    },
    {
        "authors": ["Pablo Costa"],
        "date_published": new Date(1555113600000),
        "epoch_date_submitted": 1559347200,
        "report_number": 6,
        "tags": ["variant:unreviewed"],
        "inputs_outputs": [
            "Input 1 longer than 80 characters. This is some extra text to achieve the requirement.",
            "Output 1 longer than 80 characters. This is some extra text to achieve the requirement."
        ],

        text: "This is a test variant that's unreviewed",

        // TODO: variants are missing these fields
        cloudinary_id: "",
        date_downloaded: new Date(1555113600000),
        date_modified: new Date(1592092800000),
        date_submitted: new Date(1559347200000),
        epoch_date_downloaded: 0,
        epoch_date_modified: 0,
        epoch_date_published: 0,
        image_url: "",
        language: "",
        plain_text: "",
        source_domain: "",
        submitters: [],
        url: "",
        title: "",
        editor_notes: "",
        user: "",
    },
    {
        "authors": ["Pablo Costa"],
        "date_published": new Date(1555113600000),
        "epoch_date_submitted": 1559347200,
        "report_number": 7,
        "tags": ["variant:approved"],
        "inputs_outputs": [
            "Input 1 longer than 80 characters. This is some extra text to achieve the requirement.",
            "Output 1 longer than 80 characters. This is some extra text to achieve the requirement."
        ],

        text: "This is a test variant that has been approved",

        // TODO: variants are missing these fields
        cloudinary_id: "",
        date_downloaded: new Date(1555113600000),
        date_modified: new Date(1592092800000),
        date_submitted: new Date(1559347200000),
        epoch_date_downloaded: 0,
        epoch_date_modified: 0,
        epoch_date_published: 0,
        image_url: "",
        language: "",
        plain_text: "",
        source_domain: "",
        submitters: [],
        url: "",
        title: "",
        editor_notes: "",
        user: "",
    },
    {
        "authors": ["Pablo Costa"],
        "date_published": new Date(1555113600000),
        "epoch_date_submitted": 1559347200,
        "report_number": 8,
        "tags": ["variant:rejected"],
        "inputs_outputs": [
            "Input 1 longer than 80 characters. This is some extra text to achieve the requirement.",
            "Output 1 longer than 80 characters. This is some extra text to achieve the requirement."
        ],

        text: "This is a test variant that has been rejected",

        // TODO: variants are missing these fields
        cloudinary_id: "",
        date_downloaded: new Date(1555113600000),
        date_modified: new Date(1592092800000),
        date_submitted: new Date(1559347200000),
        epoch_date_downloaded: 0,
        epoch_date_modified: 0,
        epoch_date_published: 0,
        image_url: "",
        language: "",
        plain_text: "",
        source_domain: "",
        submitters: [],
        url: "",
        title: "",
        editor_notes: "",
        user: "",
    }
]

export default items;