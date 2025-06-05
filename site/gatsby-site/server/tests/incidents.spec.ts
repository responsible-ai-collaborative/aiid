import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer } from "./utils";
import * as context from '../context';

describe(`Incidents`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });


    it(`Link reports to incidents`, async () => {

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
                    {
                        incident_id: 2,
                        reports: [2, 3]
                    },
                ],
                reports: [
                    {
                        report_number: 1,
                    },
                    {
                        report_number: 2,
                    },
                    {
                        report_number: 3,
                    },
                    {
                        report_number: 4,
                    }
                ]
            }
        });

        const mutationData = {
            query: `
            mutation($input: LinkReportsToIncidentsInput!) {
                linkReportsToIncidents(input: $input) {
                    incident_id
                    reports {
                        report_number
                    }
                }
            }
            `,
            variables: {
                input: {
                    incident_ids: [2],
                    report_numbers: [4]
                }
            }
        };


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            linkReportsToIncidents: [
                {
                    incident_id: 2,
                    reports: [
                        {
                            report_number: 2
                        },
                        {
                            report_number: 3,
                        },
                        {
                            report_number: 4,
                        },
                    ]
                }
            ]
        })
    });

    it(`Flag dissimilar`, async () => {

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
                    },
                    {
                        incident_id: 2,
                    },
                ],
            }
        });

        const mutationData = {
            query: `
            mutation ($incidentId: Int!, $dissimilarIds: [Int!]) {
                flagIncidentSimilarity(
                    incidentId: $incidentId
                    dissimilarIds: $dissimilarIds
                ) {
                    incident_id
                    flagged_dissimilar_incidents
                }
            }
            `,
            variables: {
                incidentId: 1,
                dissimilarIds: [2]
            }
        };


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            flagIncidentSimilarity: {
                incident_id: 1,
                flagged_dissimilar_incidents: [2],
            }
        })
    });

    it(`Update incident's translations`, async () => {

        // This mutation updates the Spanish translation of a incident and returns the Spanish and French translations
        const mutationData = {
            query: `
               mutation (
                    $input: UpdateOneIncidentTranslationInput!
                    $languages: [String!]!
                ) {
                updateOneIncidentTranslation(input: $input) {
                    translations(languages: $languages) {
                        title
                        description
                        language
                    }
                }
            }`,
            variables: {
                input: {
                    language: "es",
                    incident_id: 1,
                    description: "this is the description in spanish",
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
        });


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            updateOneIncidentTranslation: {
                translations: [
                    {
                        language: "es",
                        title: "this is the title in spanish",
                        description: "this is the description in spanish",
                    },
                    {
                        language: "fr",
                        title: null,
                        description: null,
                    },
                ]
            }
        })
    });
});
