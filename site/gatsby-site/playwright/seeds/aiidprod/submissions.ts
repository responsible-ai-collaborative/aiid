import { Submission } from '../../../server/generated/graphql'

type DBSubmission = Omit<Submission, 'developers' | 'deployers' | 'harmed_parties' | 'user' | 'incident_editors'>
    & { developers: string[] }
    & { deployers: string[] }
    & { harmed_parties: string[] }
    & { user: string }
    & { incident_editors: string[] }

const submissions: DBSubmission[] = [
    {
        authors: ["Author 1", "Author 2"],
        cloudinary_id: "sample_cloudinary_id",
        date_downloaded: "2021-09-14T00:00:00.000Z",
        date_modified: "2021-09-14T00:00:00.000Z",
        date_published: "2021-09-14T00:00:00.000Z",
        date_submitted: "2021-09-14T00:00:00.000Z",
        deployers: ["entity1"],
        description: "Sample description",
        developers: ["entity2"],
        harmed_parties: ["entity3"],
        incident_editors: ["editor1"],
        image_url: "https://sample_image_url.com",
        language: "en",
        source_domain: "example.com",
        submitters: ["Submitter 1", "Submitter 2"],
        tags: ["tag1", "tag2"],
        text: "Sample text",
        title: "Sample title",
        url: "http://example.com",
        user: "user1",
    }
]

export default submissions;