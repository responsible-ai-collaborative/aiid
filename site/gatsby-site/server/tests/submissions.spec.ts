import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer } from "./utils";
import * as context from '../context';
import { ObjectId } from 'bson';
import { PromoteSubmissionToReportInput } from '../generated/graphql';

describe(`Submissions`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });


    it(`Promote submission to new incident`, async () => {

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: ['incident_editor'],
                    }
                ],
            },
            aiidprod: {
                incidents: [
                    {
                        incident_id: 1,
                        reports: [1]
                    },
                ],
                reports: [
                    {
                        report_number: 1,
                    },
                ],
                submissions: [
                    {
                        _id: new ObjectId("5f8f4b3b9b3e6f001f3b3b3b"),
                        title: "Submission 1",
                    },
                ]
            }
        });

        const mutationData: { query: string, variables: { input: PromoteSubmissionToReportInput } } = {
            query: `
            mutation ($input: PromoteSubmissionToReportInput!) {
                promoteSubmissionToReport(input: $input) {
                    incident_ids
                    report_number
                }
            }
            `,
            variables: {
                input: {
                    submission_id: "5f8f4b3b9b3e6f001f3b3b3b",
                    is_incident_report: true,
                    incident_ids: [],
                }
            }
        };


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            promoteSubmissionToReport: {
                incident_ids: [2],
                report_number: 2,
            }
        })
    });

    it(`Promote submission to existing incident`, async () => {

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: ['incident_editor'],
                    }
                ],
            },
            aiidprod: {
                incidents: [
                    {
                        incident_id: 1,
                        reports: [1]
                    },
                ],
                reports: [
                    {
                        report_number: 1,
                    },
                ],
                submissions: [
                    {
                        _id: new ObjectId("5f8f4b3b9b3e6f001f3b3b3b"),
                        title: "Submission 1",
                    },
                ]
            }
        });

        const mutationData: { query: string, variables: { input: PromoteSubmissionToReportInput } } = {
            query: `
            mutation ($input: PromoteSubmissionToReportInput!) {
                promoteSubmissionToReport(input: $input) {
                    incident_ids
                    report_number
                }
            }
            `,
            variables: {
                input: {
                    submission_id: "5f8f4b3b9b3e6f001f3b3b3b",
                    is_incident_report: true,
                    incident_ids: [1],
                }
            }
        };


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            promoteSubmissionToReport: {
                incident_ids: [1],
                report_number: 2,
            }
        })
    });

    it(`Promote submission to new issue`, async () => {

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: ['incident_editor'],
                    }
                ],
            },
            aiidprod: {
                incidents: [
                    {
                        incident_id: 1,
                        reports: [1]
                    },
                ],
                reports: [
                    {
                        report_number: 1,
                    },
                ],
                submissions: [
                    {
                        _id: new ObjectId("5f8f4b3b9b3e6f001f3b3b3b"),
                        title: "Submission 1",
                    },
                ]
            }
        });

        const mutationData: { query: string, variables: { input: PromoteSubmissionToReportInput } } = {
            query: `
            mutation ($input: PromoteSubmissionToReportInput!) {
                promoteSubmissionToReport(input: $input) {
                    incident_ids
                    report_number
                }
            }
            `,
            variables: {
                input: {
                    submission_id: "5f8f4b3b9b3e6f001f3b3b3b",
                    incident_ids: [],
                }
            }
        };


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            promoteSubmissionToReport: {
                incident_ids: [],
                report_number: 2,
            }
        })
    });
});
