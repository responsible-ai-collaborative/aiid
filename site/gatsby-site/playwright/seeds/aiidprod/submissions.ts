import { ObjectId } from 'bson';
import { DBSubmission } from '../../../server/interfaces';

const submissions: DBSubmission[] = [
    {
        _id: new ObjectId("6140e4b4b9b4f7b3b3b1b1b1"),
        authors: ["Author 1", "Author 2"],
        cloudinary_id: "sample_cloudinary_id",
        date_downloaded: "2021-09-14",
        date_modified: "2021-09-14T00:00:00.000Z",
        date_published: "2021-09-14",
        date_submitted: "2021-09-14T00:00:00.000Z",
        deployers: ["entity-1"],
        description: "Sample description",
        developers: ["entity-2"],
        harmed_parties: ["entity-3"],
        incident_editors: ["editor1"],
        image_url: "https://s3.amazonaws.com/ledejs/resized/s2020-pasco-ilp/600/nocco5.jpg",
        language: "en",
        source_domain: "example.com",
        submitters: ["Submitter 1", "Submitter 2"],
        tags: ["tag1", "tag2"],
        text: "Sample text that must have at least 80 characters, so I will keep writing until I reach the minimum number of characters.",
        title: "Sample title",
        url: "http://example.com",
        user: "user1",
        incident_title: "Incident title",
        incident_date: "2021-09-14",
        editor_notes: "This is an editor note",
    },

]

export default submissions;