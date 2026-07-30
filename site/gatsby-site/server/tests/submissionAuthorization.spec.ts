import { expect, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { ObjectId } from "mongodb";
import { getCollection, makeRequest, mockSession, seedFixture, startTestServer } from "./utils";

const SUBMISSION_ID = new ObjectId("5f8f4b3b9b3e6f001f3b3b3b");

const PROMOTE = `
    mutation Promote($input: PromoteSubmissionToReportInput!) {
        promoteSubmissionToReport(input: $input) {
            incident_ids
            report_number
        }
    }
`;

const UPDATE_SUBMISSION = `
    mutation UpdateSubmission($title: String) {
        updateOneSubmission(
            filter: { _id: { EQ: "5f8f4b3b9b3e6f001f3b3b3b" } }
            update: { set: { title: $title } }
        ) {
            _id
            title
        }
    }
`;

const seed = async () => {
    await seedFixture({
        customData: {
            users: [
                { userId: "anon", roles: [] },
                { userId: "subscriber1", roles: ['subscriber'] },
                { userId: "submitter1", roles: ['submitter'] },
                { userId: "editor1", roles: ['incident_editor'] },
            ],
        },
        aiidprod: {
            incidents: [{ incident_id: 1, reports: [1] }],
            reports: [{ report_number: 1 }],
            submissions: [{ _id: SUBMISSION_ID, title: "Submission 1" }],
        },
    });
};

describe(`Submission authorization`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    beforeEach(seed);

    it(`Should not let a non-editor promote a submission`, async () => {

        for (const userId of ['anon', 'subscriber1', 'submitter1']) {

            await seed();

            mockSession(userId);

            const response = await makeRequest(url, {
                query: PROMOTE,
                variables: { input: { submission_id: SUBMISSION_ID, incident_ids: [], is_incident_report: true } },
            });

            expect(response.body.errors[0].message).toBe('not authorized');

            const incidents = await getCollection('aiidprod', 'incidents').countDocuments();

            expect(incidents).toBe(1);
        }
    });

    it(`Should let an incident_editor promote a submission`, async () => {

        mockSession('editor1');

        const response = await makeRequest(url, {
            query: PROMOTE,
            variables: { input: { submission_id: SUBMISSION_ID, incident_ids: [], is_incident_report: true } },
        });

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.promoteSubmissionToReport.report_number).toBe(2);
    });

    it(`Should not let an anonymous or subscriber user edit a queued submission`, async () => {

        for (const userId of ['anon', 'subscriber1']) {

            await seed();

            mockSession(userId);

            const response = await makeRequest(url, {
                query: UPDATE_SUBMISSION,
                variables: { title: 'Vandalised' },
            });

            expect(response.body.errors[0].message).toBe('not authorized');

            const stored = await getCollection('aiidprod', 'submissions').findOne({ _id: SUBMISSION_ID });

            expect(stored?.title).toBe('Submission 1');
        }
    });

    it(`Should let a submitter and an incident_editor edit a queued submission`, async () => {

        for (const userId of ['submitter1', 'editor1']) {

            await seed();

            mockSession(userId);

            const response = await makeRequest(url, {
                query: UPDATE_SUBMISSION,
                variables: { title: `Edited by ${userId}` },
            });

            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.updateOneSubmission.title).toBe(`Edited by ${userId}`);
        }
    });
});
