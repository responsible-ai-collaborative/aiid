import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, seedFixture, startTestServer } from "./utils";
import * as context from '../context';
import * as common from '../fields/common';
import * as emails from '../emails';
import { DBEntity, DBIncident, DBNotification, DBReport, DBSubmission, DBSubscription, DBUser } from '../interfaces';
import config from '../config';
import { IncidentFilterType, IncidentInsertType, IncidentUpdateType, PromoteSubmissionToReportInput } from '../generated/graphql';
import { ObjectId } from 'bson';
import templates from '../emails/templates';
import { replacePlaceholdersWithAllowedKeys } from '../emails';
import { processNotifications } from '../../src/scripts/process-notifications';

describe(`Notifications`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`processNotifications mutation - shouldn't send anything when notifications collection is empty`, async () => {

        await seedFixture({
            customData: {
                users: [
                    {
                        userId: "123",
                        roles: ['admin'],
                    }
                ],
                notifications: [
                    {

                    }
                ]
            },
        });


        const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();

        await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(0);
    });

    it(`processNotifications mutation - notifications of new incidents`, async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'new-incidents',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'new-incidents',
                userId: '123',
            },
            {
                type: 'incident',
                userId: '123',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '123',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "123",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: DBIncident[] = [
            {
                incident_id: 1,
                title: 'Incident 1',
                description: 'Incident 1 description',
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                date: new Date().toISOString(),
                editors: [],
                reports: [1],
                implicated_systems: [],
            }
        ]

        const reports: DBReport[] = [
            {
                report_number: 1,
                title: 'Report 1',
                description: 'Report 1 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_downloaded: 1,
                epoch_date_modified: 1,
                epoch_date_published: 1,
                epoch_date_submitted: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications,
                subscriptions,
            },
            aiidprod: {
                incidents,
                entities,
                reports,
            }
        });

        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ userId: '123', email: 'test@test.com' });

        const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();


        const result = await processNotifications();


        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "123",
                },
            ],
            subject: "New Incident {{incidentId}} was created",
            dynamicData: {
                incidentId: "1",
                incidentTitle: "Incident 1",
                incidentUrl: config.SITE_URL + "/cite/1",
                incidentDescription: "Incident 1 description",
                incidentDate: incidents[0].date,
                developers: "",
                deployers: "",
                entitiesHarmed: "",
                implicatedSystems: "",
            },
            templateId: "NewIncident",
        }));

        expect(result).toBe(1);
    });

    it(`processNotifications mutation - notifications of new incident entities`, async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'entity',
                entity_id: 'entity-1',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'entity',
                userId: '123',
                entityId: 'entity-1',
            },
            {
                type: 'incident',
                userId: '123',
                incident_id: 1,
            },
        ]

        const users: DBUser[] = [
            {
                userId: "123",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: DBIncident[] = [
            {
                incident_id: 1,
                title: 'Incident 1',
                description: 'Incident 1 description',
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                date: new Date().toISOString(),
                editors: [],
                reports: [1],
                implicated_systems: [],
            }
        ]

        const reports: DBReport[] = [
            {
                report_number: 1,
                title: 'Report 1',
                description: 'Report 1 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_downloaded: 1,
                epoch_date_modified: 1,
                epoch_date_published: 1,
                epoch_date_submitted: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications,
                subscriptions,
            },
            aiidprod: {
                incidents,
                entities,
                reports,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ userId: '123', email: 'test@test.com' });

        const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();

        const result = await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "123",
                },
            ],
            subject: "New Incident for {{entityName}}",
            dynamicData: {
                incidentId: "1",
                incidentTitle: "Incident 1",
                incidentUrl: config.SITE_URL + "/cite/1",
                incidentDescription: "Incident 1 description",
                incidentDate: incidents[0].date,
                entityName: "Entity 1",
                entityUrl: config.SITE_URL + "/entities/entity-1",
                developers: "",
                deployers: "",
                entitiesHarmed: "",
                implicatedSystems: "",
            },
            templateId: "NewEntityIncident",
        }));
        expect(result).toBe(1);
    });

    it(`processNotifications mutation - notifications of new incident reports`, async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'new-report-incident',
                incident_id: 1,
                report_number: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'incident',
                userId: '123',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '123',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "123",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: DBIncident[] = [
            {
                incident_id: 1,
                title: 'Incident 1',
                description: 'Incident 1 description',
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                date: new Date().toISOString(),
                editors: [],
                reports: [1],
                implicated_systems: [],
            }
        ]

        const reports: DBReport[] = [
            {
                report_number: 1,
                title: 'Report 1',
                description: 'Report 1 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_downloaded: 1,
                epoch_date_modified: 1,
                epoch_date_published: 1,
                epoch_date_submitted: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications,
                subscriptions,
            },
            aiidprod: {
                incidents,
                entities,
                reports,
            }
        });

        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ userId: '123', email: 'test@test.com' });
        const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();

        const result = await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "123",
                },
            ],
            subject: "Incident {{incidentId}} was updated",
            dynamicData: {
                incidentId: "1",
                incidentTitle: "Incident 1",
                incidentUrl: config.SITE_URL + "/cite/1",
                reportUrl: config.SITE_URL + "/cite/1#r1",
                reportTitle: "Report 1",
                reportAuthor: "",
            },
            templateId: "NewReportAddedToAnIncident",
        }));
        expect(result).toBe(1);
    });

    it(`processNotifications mutation - notifications of incident updates`, async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'incident-updated',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'new-incidents',
                userId: '123',
            },
            {
                type: 'incident',
                userId: '123',
                incident_id: 1,
            },
        ]

        const users: DBUser[] = [
            {
                userId: "123",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: DBIncident[] = [
            {
                incident_id: 1,
                title: 'Incident 1',
                description: 'Incident 1 description',
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                date: new Date().toISOString(),
                editors: [],
                reports: [1],
                implicated_systems: [],
            }
        ]

        const reports: DBReport[] = [
            {
                report_number: 1,
                title: 'Report 1',
                description: 'Report 1 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_downloaded: 1,
                epoch_date_modified: 1,
                epoch_date_published: 1,
                epoch_date_submitted: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications,
                subscriptions,
            },
            aiidprod: {
                incidents,
                entities,
                reports,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ userId: '123', email: 'test@test.com' });
        const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();

        const result = await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "123",
                },
            ],
            subject: "Incident {{incidentId}} was updated",
            dynamicData: {
                incidentId: "1",
                incidentTitle: "Incident 1",
                incidentUrl: config.SITE_URL + "/cite/1",
                reportUrl: config.SITE_URL + "/cite/1#rundefined",
                reportTitle: "",
                reportAuthor: "",
            },
            templateId: "IncidentUpdate",
        }));
        expect(result).toBe(1);
    });

    it(`processNotifications mutation - notifications of submission promotion`, async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'submission-promoted',
                incident_id: 1,
                userId: '123',
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'new-incidents',
                userId: '123',
            },
            {
                type: 'incident',
                userId: '123',
                incident_id: 1,
            },
        ]

        const users: DBUser[] = [
            {
                userId: "123",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: DBIncident[] = [
            {
                incident_id: 1,
                title: 'Incident 1',
                description: 'Incident 1 description',
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                date: new Date().toISOString(),
                editors: [],
                reports: [1],
                implicated_systems: [],
            }
        ]

        const reports: DBReport[] = [
            {
                report_number: 1,
                title: 'Report 1',
                description: 'Report 1 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_downloaded: 1,
                epoch_date_modified: 1,
                epoch_date_published: 1,
                epoch_date_submitted: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications,
                subscriptions,
            },
            aiidprod: {
                incidents,
                entities,
                reports,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ userId: '123', email: 'test@test.com' });
        const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();

        const result = await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "123",
                },
            ],
            subject: "Your submission has been approved!",
            dynamicData: {
                incidentId: "1",
                incidentTitle: "Incident 1",
                incidentUrl: config.SITE_URL + "/cite/1",
                incidentDescription: "Incident 1 description",
                incidentDate: incidents[0].date,
            },
            templateId: "SubmissionApproved",
        }));
        expect(result).toBe(1);
    });

    it(`Should create Incident and Entity Notifications on Incident creation`, async () => {

        const users: DBUser[] = [
            {
                userId: "user1",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications: [],
            },
            aiidprod: {
                incidents: [],
                entities,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "user1" })


        const newIncident: IncidentInsertType = {
            incident_id: 1,
            date: "2024-01-01",
            title: "Test Incident",
            editor_notes: "",
            flagged_dissimilar_incidents: [],
            AllegedDeployerOfAISystem: { link: ['entity-1'] },
            AllegedDeveloperOfAISystem: { link: [] },
            AllegedHarmedOrNearlyHarmedParties: { link: [] },
            editors: { link: ['user1'] },
            reports: { link: [] },
        }

        await makeRequest(url, {
            query: `
                mutation($data: IncidentInsertType!) {
                    insertOneIncident(data: $data) {
                        incident_id
                    }
                }
            `,
            variables: {
                data: newIncident,
            }
        });

        const result = await makeRequest(url, {
            query: `
            query {
                notifications {
                    type
                    incident_id
                    processed
                    entity_id
                }
            }
            `});

        expect(result.body.data.notifications).toMatchObject([
            {
                type: 'new-incidents',
                incident_id: 1,
                processed: false,
                entity_id: null,
            },
            {
                type: "entity",
                incident_id: 1,
                processed: false,
                entity_id: "entity-1",
            }
        ]);
    })

    it(`Should create Incident and Entity Notifications on submission promotion`, async () => {

        const users: DBUser[] = [
            {
                userId: "user1",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const submissions: DBSubmission[] = [
            {
                _id: new ObjectId("5f8f4b3b9b3e6f001f3b3b3b"),
                title: "Submission 1",
                authors: [],
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_modified: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                developers: [],
                deployers: ['entity-1'],
                harmed_parties: [],
                incident_editors: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
                implicated_systems: [],
            },
        ]

        await seedFixture({
            customData: {
                users,
                notifications: [],
            },
            aiidprod: {
                incidents: [],
                reports: [],
                entities,
                submissions,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "user1" })

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


        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            promoteSubmissionToReport: {
                incident_ids: [1],
                report_number: 1,
            }
        })

        const result = await makeRequest(url, {
            query: `
            query {
                notifications {
                    type
                    incident_id
                    processed
                    entity_id
                }
            }
            `});

        expect(result.body.data.notifications).toMatchObject([
            {
                type: "new-incidents",
                incident_id: 1,
                processed: false,
                entity_id: null,
            },
            {
                entity_id: "entity-1",
                incident_id: 1,
                processed: false,
                type: "entity",
            },
            {
                type: "submission-promoted",
                incident_id: 1,
                processed: false,
                entity_id: null,
            },
        ]);
    });

    it(`Should create Incident and Entity Notifications on Incident edition`, async () => {

        const users: DBUser[] = [
            {
                userId: "user1",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            },
            {
                entity_id: 'entity-2',
                name: 'Entity 2',
            },
        ]

        const incidents: DBIncident[] = [
            {
                _id: new ObjectId("60a7c5b7b4f5b8a6d8f9c7e0"),
                incident_id: 1,
                date: "2023-01-14T00:00:00.000Z",
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                description: "Test description 1",
                title: "Test Incident 1",
                editors: [
                    "user1"
                ],
                nlp_similar_incidents: [
                    {
                        incident_id: 2,
                        similarity: 0.9
                    },
                    {
                        incident_id: 3,
                        similarity: 0.85
                    }
                ],
                editor_similar_incidents: [],
                editor_dissimilar_incidents: [],
                flagged_dissimilar_incidents: [],
                embedding: {
                    vector: [
                        0.1,
                        0.2,
                    ],
                    from_reports: [
                        105,
                        104,
                    ],
                },
                tsne: {
                    x: -0.1,
                    y: -0.2
                },
                reports: [1],
                editor_notes: "Sample editor notes",
                implicated_systems: [],
            },

        ]

        const reports: DBReport[] = [
            {
                _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
                authors: ["Author 1", "Author 2"],
                cloudinary_id: "sample_cloudinary_id",
                date_downloaded: "2021-09-14T00:00:00.000Z",
                date_modified: "2021-09-14T00:00:00.000Z",
                date_published: "2021-09-14T00:00:00.000Z",
                date_submitted: "2021-09-14T00:00:00.000Z",
                description: "Sample description",
                editor_notes: "Sample editor notes",
                embedding: {
                    from_text_hash: "sample_hash",
                    vector: [0.1, 0.2, 0.3]
                },
                epoch_date_downloaded: 1631577600,
                epoch_date_modified: 1631577600,
                epoch_date_published: 1631577600,
                epoch_date_submitted: 1631577600,
                flag: false,
                image_url: "http://example.com/image.png",
                inputs_outputs: ["input1", "output1"],
                is_incident_report: true,
                language: "en",
                plain_text: "Sample plain text",
                report_number: 1,
                source_domain: "example.com",
                submitters: ["Submitter 1", "Submitter 2"],
                tags: ["tag1", "tag2"],
                text: "Sample text",
                title: "Sample title",
                url: "http://example.com",
                user: "user1",
                quiet: false,
            },
            {
                _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e9'),
                authors: ["Author 5", "Author 6"],
                cloudinary_id: "sample_cloudinary_id_3",
                date_downloaded: "2022-10-14T00:00:00.000Z",
                date_modified: "2022-10-14T00:00:00.000Z",
                date_published: "2022-10-14T00:00:00.000Z",
                date_submitted: "2022-10-14T00:00:00.000Z",
                description: "Another sample description",
                editor_notes: "Another sample editor notes",
                embedding: {
                    from_text_hash: "sample_hash_3",
                    vector: [0.7, 0.8, 0.9]
                },
                epoch_date_downloaded: 1665705600,
                epoch_date_modified: 1665705600,
                epoch_date_published: 1665705600,
                epoch_date_submitted: 1665705600,
                flag: true,
                image_url: "http://example3.com/image3.png",
                inputs_outputs: ["input3", "output3"],
                is_incident_report: false,
                language: "es",
                plain_text: "Another sample plain text",
                report_number: 2,
                source_domain: "example3.com",
                submitters: ["Submitter 5", "Submitter 6"],
                tags: ["tag5", "tag6"],
                text: "Another sample text",
                title: "Another sample title",
                url: "http://example3.com",
                user: "user1",
                quiet: true,
            }
        ]




        await seedFixture({
            customData: {
                users,
                notifications: [],
            },
            aiidprod: {
                incidents,
                reports,
                entities,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "user1" })

        const mutationData: { query: string, variables: { filter: IncidentFilterType, update: IncidentUpdateType } } = {
            query: `
                mutation($filter: IncidentFilterType!, $update: IncidentUpdateType!) {
                    updateOneIncident(filter: $filter, update: $update) {
                        incident_id
                    }
                }
            `,
            variables: {
                filter: { incident_id: { EQ: 1 } },
                update: {
                    set: {
                        title: "Edited Title",
                        reports: { link: [1, 2] },
                        AllegedDeployerOfAISystem: { link: ["entity-2"] }
                    }
                },
            }
        };


        await makeRequest(url, mutationData);

        const result = await makeRequest(url, {
            query: `
            query {
                notifications {
                    type
                    incident_id
                    processed
                    entity_id
                }
            }
            `});

        expect(result.body.data.notifications).toMatchObject([
            {
                type: "new-report-incident",
                incident_id: 1,
                processed: false,
                entity_id: null,
            },
            {
                type: "entity",
                incident_id: 1,
                processed: false,
                entity_id: "entity-2",
            },
        ]);
    })

    it(`Shouldn't create notifications for fields not monitored`, async () => {

        const users: DBUser[] = [
            {
                userId: "user1",
                roles: ['admin'],
            }
        ]

        const incidents: DBIncident[] = [
            {
                _id: new ObjectId("60a7c5b7b4f5b8a6d8f9c7e0"),
                incident_id: 1,
                date: "2023-01-14T00:00:00.000Z",
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                description: "Test description 1",
                title: "Test Incident 1",
                editors: [
                    "user1"
                ],
                nlp_similar_incidents: [
                    {
                        incident_id: 2,
                        similarity: 0.9
                    },
                    {
                        incident_id: 3,
                        similarity: 0.85
                    }
                ],
                editor_similar_incidents: [],
                editor_dissimilar_incidents: [],
                flagged_dissimilar_incidents: [],
                embedding: {
                    vector: [
                        0.1,
                        0.2,
                    ],
                    from_reports: [
                        105,
                        104,
                    ],
                },
                tsne: {
                    x: -0.1,
                    y: -0.2
                },
                reports: [],
                editor_notes: "Sample editor notes",
                implicated_systems: [],
            },

        ]

        await seedFixture({
            customData: {
                users,
                notifications: [],
            },
            aiidprod: {
                incidents,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "user1" })

        const mutationData: { query: string, variables: { filter: IncidentFilterType, update: IncidentUpdateType } } = {
            query: `
                mutation($filter: IncidentFilterType!, $update: IncidentUpdateType!) {
                    updateOneIncident(filter: $filter, update: $update) {
                        incident_id
                    }
                }
            `,
            variables: {
                filter: { incident_id: { EQ: 1 } },
                update: {
                    set: {
                        epoch_date_modified: 1,
                    }
                },
            }
        };

        await makeRequest(url, mutationData);

        const result = await makeRequest(url, {
            query: `
            query {
                notifications {
                    type
                    incident_id
                    processed
                    entity_id
                }
            }
            `});

        expect(result.body.data.notifications).toMatchObject([]);
    })

    it(`Should use bulk email API`, async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'new-incidents',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'new-incidents',
                userId: 'user1',
            },
            {
                type: 'new-incidents',
                userId: 'user2',
            },
            {
                type: 'incident',
                userId: 'user1',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: 'user1',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "user1",
                roles: ['admin'],
            },
            {
                userId: "user2",
                roles: ['subscriber'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            },
            {
                entity_id: 'entity-2',
                name: 'Entity 2',
            }
        ]

        const incidents: DBIncident[] = [
            {
                incident_id: 1,
                title: 'Incident 1',
                description: 'Incident 1 description',
                "Alleged deployer of AI system": ['entity-1'],
                "Alleged developer of AI system": ['entity-1'],
                "Alleged harmed or nearly harmed parties": ['entity-1'],
                date: new Date().toISOString(),
                editors: [],
                reports: [1],
                implicated_systems: ['entity-1'],
            }
        ]

        const reports: DBReport[] = [
            {
                report_number: 1,
                title: 'Report 1',
                description: 'Report 1 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_downloaded: 1,
                epoch_date_modified: 1,
                epoch_date_published: 1,
                epoch_date_submitted: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications,
                subscriptions,
            },
            aiidprod: {
                incidents,
                entities,
                reports,
            }
        });

        const mutationData = {
            query: `
                mutation {
                    processNotifications
                }
            `,
        };

        jest.spyOn(emails, 'sendEmail').mockRestore();
        jest.spyOn(common, 'getUserAdminData').mockResolvedValueOnce({ userId: 'user1', email: 'test@test.com' })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValueOnce({ userId: 'user2', email: 'test2@test.com' });

        const mockMailersendBulkSend = jest.spyOn(emails, 'mailersendBulkSend').mockResolvedValue();

        const result = await processNotifications();

        expect(result).toBe(1);

        expect(mockMailersendBulkSend.mock.calls[0][0][0]).toMatchObject({
            from: {
                email: config.NOTIFICATIONS_SENDER,
                name: config.NOTIFICATIONS_SENDER_NAME,
            },
            to: [
                {
                    email: "test@test.com",
                    name: "",
                },
            ],
            cc: undefined,
            bcc: undefined,
            reply_to: undefined,
            in_reply_to: undefined,
            subject: "New Incident {{incidentId}} was created",
            text: undefined,
            html: replacePlaceholdersWithAllowedKeys(templates.NewIncident, {
                deployers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                developers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                entitiesHarmed: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                implicatedSystems: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
            }, ['developers', 'deployers', 'entitiesHarmed', 'implicatedSystems']),
            send_at: undefined,
            attachments: undefined,
            template_id: undefined,
            tags: undefined,
            personalization: [
                {
                    email: "test@test.com",
                    data: {
                        incidentId: "1",
                        incidentTitle: "Incident 1",
                        incidentUrl: "http://localhost:8000/cite/1",
                        incidentDescription: "Incident 1 description",
                        incidentDate: incidents[0].date,
                        deployers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        developers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        entitiesHarmed: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        email: "test@test.com",
                        userId: "user1",
                        siteUrl: "http://localhost:8000",
                        implicatedSystems: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                    },
                },
            ],
            precedence_bulk: undefined,
        })

        expect(mockMailersendBulkSend.mock.calls[0][0][1]).toMatchObject({
            from: {
                email: config.NOTIFICATIONS_SENDER,
                name: config.NOTIFICATIONS_SENDER_NAME,
            },
            to: [
                {
                    email: "test2@test.com",
                    name: "",
                },
            ],
            cc: undefined,
            bcc: undefined,
            reply_to: undefined,
            in_reply_to: undefined,
            subject: "New Incident {{incidentId}} was created",
            text: undefined,
            html: replacePlaceholdersWithAllowedKeys(templates.NewIncident, {
                deployers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                developers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                entitiesHarmed: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                implicatedSystems: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
            }, ['developers', 'deployers', 'entitiesHarmed', 'implicatedSystems']),
            send_at: undefined,
            attachments: undefined,
            template_id: undefined,
            tags: undefined,
            personalization: [
                {
                    email: "test2@test.com",
                    data: {
                        incidentId: "1",
                        incidentTitle: "Incident 1",
                        incidentUrl: "http://localhost:8000/cite/1",
                        incidentDescription: "Incident 1 description",
                        incidentDate: incidents[0].date,
                        deployers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        developers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        entitiesHarmed: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        email: "test2@test.com",
                        userId: "user2",
                        siteUrl: "http://localhost:8000",
                        implicatedSystems: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                    },
                },
            ],
            precedence_bulk: undefined,
        })
    });

    it('Should throw and revert notifications status on error', async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'new-incidents',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'new-incidents',
                userId: '123',
            },
            {
                type: 'incident',
                userId: '123',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '123',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "123",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: DBIncident[] = [
            {
                incident_id: 1,
                title: 'Incident 1',
                description: 'Incident 1 description',
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                date: new Date().toISOString(),
                editors: [],
                reports: [1],
                implicated_systems: [],
            }
        ]

        const reports: DBReport[] = [
            {
                report_number: 1,
                title: 'Report 1',
                description: 'Report 1 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_downloaded: 1,
                epoch_date_modified: 1,
                epoch_date_published: 1,
                epoch_date_submitted: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications,
                subscriptions,
            },
            aiidprod: {
                incidents,
                entities,
                reports,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ userId: '123', email: 'test@test.com' });

        const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockImplementation(() => {
            throw new Error('Failed to send email');
        });


        await expect(processNotifications()).rejects.toThrow('Failed to send email');
        expect(sendEmailMock).toHaveBeenCalledTimes(1);

        const result = await makeRequest(url, {
            query: `
            query {
                notifications {
                    type
                    incident_id
                    processed
                    entity_id
                }
            }
            `});

        expect(result.body.data.notifications).toMatchObject([
            {
                type: 'new-incidents',
                incident_id: 1,
                processed: false,
                entity_id: null,
            },
        ]);
    });

    it('Should not crash if no recipients found', async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'new-incidents',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'new-incidents',
                userId: '123',
            },
            {
                type: 'incident',
                userId: '123',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '123',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "123",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: DBIncident[] = [
            {
                incident_id: 1,
                title: 'Incident 1',
                description: 'Incident 1 description',
                "Alleged deployer of AI system": [],
                "Alleged developer of AI system": [],
                "Alleged harmed or nearly harmed parties": [],
                date: new Date().toISOString(),
                editors: [],
                reports: [1],
                implicated_systems: [],
            }
        ]

        const reports: DBReport[] = [
            {
                report_number: 1,
                title: 'Report 1',
                description: 'Report 1 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
                epoch_date_downloaded: 1,
                epoch_date_modified: 1,
                epoch_date_published: 1,
                epoch_date_submitted: 1,
                image_url: 'image_url',
                language: 'en',
                plain_text: 'plain_text',
                source_domain: 'source_domain',
                submitters: [],
                tags: [],
                text: 'text',
                url: 'url',
                user: 'user_id',
            }
        ]

        await seedFixture({
            customData: {
                users,
                notifications,
                subscriptions,
            },
            aiidprod: {
                incidents,
                entities,
                reports,
            }
        });


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })

        // No recipients
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue(null);

        const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockImplementation(() => {
            throw new Error('Failed to send email');
        });


        await processNotifications();

        expect(sendEmailMock).not.toHaveBeenCalled();

        const result = await makeRequest(url, {
            query: `
            query {
                notifications {
                    type
                    incident_id
                    processed
                    entity_id
                }
            }
            `});

        // notifications should be marked as processed
        expect(result.body.data.notifications).toMatchObject([
            {
                type: 'new-incidents',
                incident_id: 1,
                processed: true,
                entity_id: null,
            },
        ]);
    });
});
