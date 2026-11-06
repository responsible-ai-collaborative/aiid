import { expect, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { ObjectId } from "mongodb";
import { getCollection, makeRequest, mockSession, seedFixture, startTestServer } from "./utils";

const SUBMISSION_ID = new ObjectId("5f8f4b3b9b3e6f001f3b3b3b");

const REJECT = `
    mutation Reject($input: RejectSubmissionInput!) {
        rejectSubmission(input: $input) {
            _id
            status
            rejection_reason
            rejected_at
            rejected_by
        }
    }
`;

const RESTORE = `
    mutation Restore($input: RestoreSubmissionInput!) {
        restoreSubmission(input: $input) {
            _id
            status
            rejection_reason
            rejected_at
            rejected_by
        }
    }
`;

/**
 * Rejecting keeps the submission, marked with the rationale, date and editor,
 * so the queue can hide it and an editor can restore it. SEE: #4085
 */
describe('Submission rejection', () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    beforeEach(async () => {
        await seedFixture({
            customData: {
                users: [
                    { userId: "subscriber1", roles: ['subscriber'] },
                    { userId: "submitter1", roles: ['submitter'] },
                    { userId: "editor1", roles: ['incident_editor'] },
                ],
            },
            aiidprod: {
                submissions: [{ _id: SUBMISSION_ID, title: "Submission 1", status: 'inReview', incident_editors: ['editor1'] }],
            },
        });
    });

    it('an editor rejects a submission with a rationale and the record is kept', async () => {

        mockSession('editor1');

        const before = Date.now();

        const response = await makeRequest(url, { query: REJECT, variables: { input: { submission_id: SUBMISSION_ID, reason: '  Duplicate of incident 12  ' } } });

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.rejectSubmission).toMatchObject({
            _id: SUBMISSION_ID.toHexString(),
            status: 'rejected',
            rejection_reason: 'Duplicate of incident 12',
            rejected_by: 'editor1',
        });

        expect(new Date(response.body.data.rejectSubmission.rejected_at).getTime()).toBeGreaterThanOrEqual(before - 1000);

        const stored = await getCollection('aiidprod', 'submissions').findOne({ _id: SUBMISSION_ID });

        expect(stored).toMatchObject({ title: 'Submission 1', status: 'rejected', rejection_reason: 'Duplicate of incident 12', rejected_by: 'editor1', incident_editors: ['editor1'] });
        expect(stored!.rejected_at).toBeInstanceOf(Date);

        // Still returned by the submissions query, so the queue can show it on request.
        const list = await makeRequest(url, { query: `{ submissions { _id status rejection_reason } }` });

        expect(list.body.data.submissions).toEqual([{ _id: SUBMISSION_ID.toHexString(), status: 'rejected', rejection_reason: 'Duplicate of incident 12' }]);
    });

    it('a rejection without a rationale is allowed', async () => {

        mockSession('editor1');

        const response = await makeRequest(url, { query: REJECT, variables: { input: { submission_id: SUBMISSION_ID } } });

        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.rejectSubmission).toMatchObject({ status: 'rejected', rejection_reason: '' });
    });

    it('an editor restores a rejected submission to the queue', async () => {

        mockSession('editor1');

        await makeRequest(url, { query: REJECT, variables: { input: { submission_id: SUBMISSION_ID, reason: 'Mistake' } } });

        const response = await makeRequest(url, { query: RESTORE, variables: { input: { submission_id: SUBMISSION_ID } } });

        expect(response.body.errors).toBeUndefined();

        expect(response.body.data.restoreSubmission).toEqual({
            _id: SUBMISSION_ID.toHexString(),
            status: 'pendingReview',
            rejection_reason: null,
            rejected_at: null,
            rejected_by: null,
        });

        const stored = await getCollection('aiidprod', 'submissions').findOne({ _id: SUBMISSION_ID });

        expect(stored).not.toHaveProperty('rejection_reason');
        expect(stored).not.toHaveProperty('rejected_at');
        expect(stored).not.toHaveProperty('rejected_by');
    });

    it('restoring a submission that is not rejected fails', async () => {

        mockSession('editor1');

        const response = await makeRequest(url, { query: RESTORE, variables: { input: { submission_id: SUBMISSION_ID } } });

        expect(response.body.errors?.[0].message).toBe('Submission is not rejected');
    });

    it('rejecting an unknown submission fails', async () => {

        mockSession('editor1');

        const response = await makeRequest(url, { query: REJECT, variables: { input: { submission_id: new ObjectId("5f8f4b3b9b3e6f001f3b3b3c") } } });

        expect(response.body.errors?.[0].message).toBe('Submission not found');
    });

    it('only an editor may reject or restore', async () => {

        for (const userId of ['subscriber1', 'submitter1']) {

            mockSession(userId);

            const reject = await makeRequest(url, { query: REJECT, variables: { input: { submission_id: SUBMISSION_ID, reason: 'x' } } });

            expect(reject.body.errors?.[0].message).toBe('not authorized');

            const restore = await makeRequest(url, { query: RESTORE, variables: { input: { submission_id: SUBMISSION_ID } } });

            expect(restore.body.errors?.[0].message).toBe('not authorized');
        }

        const stored = await getCollection('aiidprod', 'submissions').findOne({ _id: SUBMISSION_ID });

        expect(stored!.status).toBe('inReview');
    });
});
