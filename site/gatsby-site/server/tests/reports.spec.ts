import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer } from "./utils";
import * as context from '../context';

describe(`Reports`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });


    it(`Flag report`, async () => {

        const mutationData = {
            query: `
                mutation($reportNumber: Int!, $input: Boolean!) {
                    flagReport(report_number: $reportNumber, input: $input) {
                        report_number
                        flag
                        date_modified
                        epoch_date_modified
                    }
                }
                    `,
            variables: {

                "reportNumber": 1,
                "input": true
            }
        };


        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: [],
                    }
                ],
            },
            aiidprod: {
                reports: [
                    {
                        report_number: 1,
                        flag: false
                    }
                ]
            }
        });


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            flagReport: {
                report_number: 1,
                flag: true,
                date_modified: expect.any(String),
                epoch_date_modified: expect.any(Number),
            }
        })
    });

    it(`Update reports translations`, async () => {

        // This mutation updates the Spanish translation of a report and returns the Spanish and French translations
        const mutationData = {
            query: `
               mutation (
                    $input: UpdateOneReportTranslationInput!
                    $languages: [String!]!
                ) {
                updateOneReportTranslation(input: $input) {
                    translations(languages: $languages) {
                        title
                        text
                        plain_text
                        language
                    }
                }
            }`,
            variables: {
                input: {
                    language: "es",
                    plain_text: "this is plain text in spanish",
                    report_number: 1,
                    text: "this is the text in spanish",
                    title: "this is the title in spanish"
                },
                languages: ["es", "fr"]
            }
        };


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
                reports: [
                    {
                        report_number: 1,
                        flag: false
                    }
                ]
            }
        });


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            updateOneReportTranslation: {
                translations: [
                    {
                        language: "es",
                        title: "this is the title in spanish",
                        text: "this is the text in spanish",
                        plain_text: "this is plain text in spanish",
                    },
                    {
                        language: "fr",
                        title: null,
                        text: null,
                        plain_text: null,
                    },
                ]
            }
        })
    });

    it(`Create a variant`, async () => {

        const mutationData = {
            query: `
                mutation ($input: CreateVariantInput!) {
                    createVariant(input: $input) {
                        incident_id
                        report_number
                    }
                }
                    `,
            variables: {
                input: {
                    incidentId: 1,
                    variant: {
                        date_published: "2024-01-01",
                        inputs_outputs: ["input output 1", "input output 2"],
                        submitters: ["Test"],
                        text: "Some text larger than 80 characters"
                    }
                }
            }
        };


        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: [],
                    }
                ],
            },
            aiidprod: {
                incidents: [
                    {
                        incident_id: 1,
                        reports: [1]
                    }
                ],
                reports: [
                    {
                        report_number: 1,
                        flag: false
                    }
                ]
            }
        });


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            createVariant: {
                report_number: 2,
                incident_id: 1,
            }
        })
    });
});
