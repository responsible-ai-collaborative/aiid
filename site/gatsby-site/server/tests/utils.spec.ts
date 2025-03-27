import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer } from "./utils";
import * as context from '../context';

describe(`Utils`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`Should return invalid linked id error - insertOne`, async () => {

        const mutationData = {
            query: `
                mutation($data: IncidentInsertType!) {
                    insertOneIncident(data: $data) {
                        incident_id
                        reports {
                        report_number
                        }
                    }
                }
                    `,
            variables: {
                "data": {
                    "incident_id": 9999,
                    "AllegedDeployerOfAISystem": {
                        "link": [
                            "entity-1"
                        ]
                    },
                    "reports": {
                        "link": [
                            1
                        ]
                    },
                    "date": "2029-01-01",
                    "title": "Test",
                    "editor_notes": "",
                    "flagged_dissimilar_incidents": []
                }
            }

        };

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: ['admin'],
                    }
                ],
            },
        });


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            insertOneIncident: null,
        });
        expect(response.body.errors).toMatchObject([{
            "extensions": {
                "code": "INTERNAL_SERVER_ERROR",
            },
            "message": "Invalid linked ids: AllegedDeployerOfAISystem -> [entity-1]",
            "path": [
                "insertOneIncident",
            ],
        }]);
    });

    // TODO: add insertMany tests once classifications are migrated to the new schema

    it(`Should return invalid linked id error - updateMany`, async () => {

        const mutationData = {
            query: `
                mutation($filter: IncidentFilterType!, $update: IncidentUpdateType!) {
                    updateManyIncidents(filter: $filter, update: $update) {
                        matchedCount
                        modifiedCount
                    }
                }
                    `,
            variables: {
                "update": {
                    "set": {
                        "incident_id": 9999,
                        "reports": {
                            "link": [
                                45
                            ]
                        },
                        "date": "2029-01-01",
                        "title": "Test"
                    }
                },
                "filter": {
                    "reports": {
                        "EQ": 1
                    }
                }
            }
        };

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: ['admin'],
                    }
                ],
            },
        });


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            updateManyIncidents: null,
        });
        expect(response.body.errors).toMatchObject([{
            "extensions": {
                "code": "INTERNAL_SERVER_ERROR",
            },
            "message": "Invalid linked ids: reports -> [45]",
            "path": [
                "updateManyIncidents",
            ],
        }]);
    });

    it(`Should return invalid linked id error - updateOne`, async () => {

        const mutationData = {
            query: `
                mutation($filter: SubmissionFilterType!, $update: SubmissionUpdateType!) {
                    updateOneSubmission(filter: $filter, update: $update) {
                        _id
                        user {
                        userId
                        }
                    }
                }
                    `,
            variables: {
                "filter": { "_id": { "EQ": "66be58a854065d58fd99dbdb" } },
                "update": {
                    "set": {
                        "user": {
                            "link": "2"
                        }
                    }
                }
            }
        };

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: ['admin'],
                    }
                ],
            },
        });


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            updateOneSubmission: null,
        });
        expect(response.body.errors).toMatchObject([{
            "extensions": {
                "code": "INTERNAL_SERVER_ERROR",
            },
            "message": "Invalid linked id: user -> 2",
            "path": [
                "updateOneSubmission",
            ],
        }]);
    });

    // TODO: add upsertOne tests once classifications are migrated to the new schema
});
