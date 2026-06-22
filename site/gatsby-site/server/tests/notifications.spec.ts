import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer } from "./utils";
import * as userCacheManager from '../fields/userCacheManager';
import * as emails from '../emails';
import { DBEntity, DBIncident, DBNotification, DBReport, DBSubmission, DBSubscription, DBUser } from '../interfaces';
import config from '../config';
import { IncidentFilterType, IncidentInsertType, IncidentUpdateType, PromoteSubmissionToReportInput } from '../generated/graphql';
import { ObjectId } from 'bson';
import templates from '../emails/templates';
import { processNotifications } from '../../src/scripts/process-notifications';
import nunjucks from 'nunjucks';

// Mirrors formatIncidentDate() in process-notifications.ts so date assertions stay in sync.
const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : undefined;

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


        mockSession('123');
        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockResolvedValue();

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
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
            },
            {
                type: 'incident',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                roles: ['admin'],
            }
        ]

        const authUsers = [
            {
                _id: new ObjectId('5f8f4b3b9b3e6f001f3b3b3b'),
                email: 'test@test.com',
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: Partial<DBIncident>[] = [
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
            },
            auth: {
                users: authUsers,
            }
        });

        mockSession('5f8f4b3b9b3e6f001f3b3b3b');


        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockResolvedValue();


        const result = await processNotifications();


        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "5f8f4b3b9b3e6f001f3b3b3b",
                    subject: "AI Incident Database: 1 new incident",
                    dynamicData: {
                        newIncidents: [{
                            incidentId: "1",
                            incidentTitle: "Incident 1",
                            incidentUrl: config.SITE_URL + "/cite/1",
                            incidentDescription: "Incident 1 description",
                            incidentDate: formatDate(incidents[0].date),
                            reportImageUrl: "image_url",
                            developers: "",
                            deployers: "",
                            entitiesHarmed: "",
                            implicatedSystems: "",
                        }],
                        entityEvents: [],
                        incidentUpdates: [],
                        submissionsPromoted: [],
                    },
                },
            ],
            subject: "AI Incident Database Notifications",
            templateId: "Notifications",
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
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                entityId: 'entity-1',
            },
            {
                type: 'incident',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            },
        ]

        const users: DBUser[] = [
            {
                userId: "5f8f4b3b9b3e6f001f3b3b3b",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: Partial<DBIncident>[] = [
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
            },
            auth: {
                users: [
                    {
                        _id: new ObjectId('5f8f4b3b9b3e6f001f3b3b3b'),
                        email: 'test@test.com',
                        roles: ['admin'],
                    }
                ]
            }
        });


        mockSession('5f8f4b3b9b3e6f001f3b3b3b');

        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockResolvedValue();

        const result = await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "5f8f4b3b9b3e6f001f3b3b3b",
                    subject: "AI Incident Database: 1 entity update",
                    dynamicData: {
                        newIncidents: [],
                        entityEvents: [{
                            incidentId: "1",
                            incidentTitle: "Incident 1",
                            incidentUrl: config.SITE_URL + "/cite/1",
                            incidentDescription: "Incident 1 description",
                            incidentDate: formatDate(incidents[0].date),
                            reportImageUrl: "image_url",
                            entityName: "Entity 1",
                            entityUrl: config.SITE_URL + "/entities/entity-1",
                            developers: "",
                            deployers: "",
                            entitiesHarmed: "",
                            implicatedSystems: "",
                            isUpdate: false,
                        }],
                        incidentUpdates: [],
                        submissionsPromoted: [],
                    },
                },
            ],
            subject: "AI Incident Database Notifications",
            templateId: "Notifications",
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
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "5f8f4b3b9b3e6f001f3b3b3b",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: Partial<DBIncident>[] = [
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
            },
            auth: {
                users: [
                    {
                        _id: new ObjectId('5f8f4b3b9b3e6f001f3b3b3b'),
                        email: 'test@test.com',
                        roles: ['admin'],
                    }
                ]
            }
        });

        mockSession('5f8f4b3b9b3e6f001f3b3b3b');

        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockResolvedValue();

        const result = await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "5f8f4b3b9b3e6f001f3b3b3b",
                    subject: "AI Incident Database: 1 incident update",
                    dynamicData: {
                        newIncidents: [],
                        entityEvents: [],
                        incidentUpdates: [{
                            incidentId: "1",
                            incidentTitle: "Incident 1",
                            incidentUrl: config.SITE_URL + "/cite/1",
                            reportUrl: config.SITE_URL + "/cite/1#r1",
                            reportTitle: "Report 1",
                            reportAuthor: undefined,
                        }],
                        submissionsPromoted: [],
                    },
                },
            ],
            subject: "AI Incident Database Notifications",
            templateId: "Notifications",
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
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
            },
            {
                type: 'incident',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            },
        ]

        const users: DBUser[] = [
            {
                userId: "5f8f4b3b9b3e6f001f3b3b3b",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: Partial<DBIncident>[] = [
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
            },
            auth: {
                users: [
                    {
                        _id: new ObjectId('5f8f4b3b9b3e6f001f3b3b3b'),
                        email: 'test@test.com',
                        roles: ['admin'],
                    }
                ]
            }
        });


        mockSession('5f8f4b3b9b3e6f001f3b3b3b');

        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockResolvedValue();

        const result = await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "5f8f4b3b9b3e6f001f3b3b3b",
                    subject: "AI Incident Database: 1 incident update",
                    dynamicData: {
                        newIncidents: [],
                        entityEvents: [],
                        incidentUpdates: [{
                            incidentId: "1",
                            incidentTitle: "Incident 1",
                            incidentUrl: config.SITE_URL + "/cite/1",
                            reportUrl: undefined,
                            reportTitle: undefined,
                            reportAuthor: undefined,
                        }],
                        submissionsPromoted: [],
                    },
                },
            ],
            subject: "AI Incident Database Notifications",
            templateId: "Notifications",
        }));
        expect(result).toBe(1);
    });

    it(`processNotifications mutation - notifications of submission promotion`, async () => {

        const notifications: DBNotification[] = [
          {
              processed: false,
              type: 'submission-promoted',
              incident_id: 1,
              userId: '5f8f4b3b9b3e6f001f3b3b3b',
          },
          {
              processed: false,
              type: 'submission-promoted',
              incident_id: 2,
              userId: '60a7c5b7b4f5b8a6d8f9c7e4',
          },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'new-incidents',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
            },
            {
                type: 'incident',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            },
        ]

        const users: DBUser[] = [
            {
                userId: "5f8f4b3b9b3e6f001f3b3b3b",
                roles: ['admin'],
            },
            {
                userId: "60a7c5b7b4f5b8a6d8f9c7e4",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: Partial<DBIncident>[] = [
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
            },

            {
              incident_id: 2,
              title: 'Incident 2',
              description: 'Incident 2 description',
              "Alleged deployer of AI system": [],
              "Alleged developer of AI system": [],
              "Alleged harmed or nearly harmed parties": [],
              date: new Date().toISOString(),
              editors: [],
              reports: [2],
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
            },
            auth: {
                users: [
                    {
                        _id: new ObjectId('5f8f4b3b9b3e6f001f3b3b3b'),
                        email: 'test@test.com',
                        roles: ['admin'],
                    },
                    {
                        _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e4'),
                        email: 'user2@test.com',
                        roles: ['admin'],
                    }
                ]
            }
        });


        mockSession('5f8f4b3b9b3e6f001f3b3b3b');
        mockSession('60a7c5b7b4f5b8a6d8f9c7e4');

        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockResolvedValue();

        const result = await processNotifications();

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
        expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
            recipients: [
                {
                    email: "test@test.com",
                    userId: "5f8f4b3b9b3e6f001f3b3b3b",
                    subject: "AI Incident Database: 1 approved submission",
                    dynamicData: {
                        newIncidents: [],
                        entityEvents: [],
                        incidentUpdates: [],
                        submissionsPromoted: [{
                            incidentId: "1",
                            incidentTitle: "Incident 1",
                            incidentUrl: config.SITE_URL + "/cite/1",
                            incidentDescription: "Incident 1 description",
                            incidentDate: formatDate(incidents[0].date),
                            reportImageUrl: "image_url",
                        }],
                    },
                },
                {
                    email: "user2@test.com",
                    userId: "60a7c5b7b4f5b8a6d8f9c7e4",
                    subject: "AI Incident Database: 1 approved submission",
                    dynamicData: {
                        newIncidents: [],
                        entityEvents: [],
                        incidentUpdates: [],
                        submissionsPromoted: [{
                            incidentId: "2",
                            incidentTitle: "Incident 2",
                            incidentUrl: config.SITE_URL + "/cite/2",
                            incidentDescription: "Incident 2 description",
                            incidentDate: formatDate(incidents[1].date),
                        }],
                    },
                },
            ],
            subject: "AI Incident Database Notifications",
            templateId: "Notifications",
        }));

        expect(result).toBe(2);
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


        mockSession('user1');


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
            date_modified: "2024-01-01T00:00:00.000Z",
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
                type: "ai-briefing",
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


        mockSession('user1');

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
                entity_id: null,
                incident_id: 1,
                processed: false,
                type: "ai-briefing",
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
                date_modified: "2023-01-14T00:00:00.000Z",
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


        mockSession('user1');

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
                date_modified: "2023-01-14T00:00:00.000Z",
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


        mockSession('user1');

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
                        date_modified: new Date().toISOString(),
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
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
            },
            {
                type: 'new-incidents',
                userId: '5f8f4b3b9b3e6f001f3b3b3c',
            },
            {
                type: 'incident',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "5f8f4b3b9b3e6f001f3b3b3b",
                roles: ['admin'],
            },
            {
                userId: "5f8f4b3b9b3e6f001f3b3b3c",
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

        const incidents: Partial<DBIncident>[] = [
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
            },
            auth: {
                users: [
                    {
                        _id: new ObjectId('5f8f4b3b9b3e6f001f3b3b3b'),
                        email: 'test@test.com',
                        roles: ['admin'],
                    },
                    {
                        _id: new ObjectId('5f8f4b3b9b3e6f001f3b3b3c'),
                        email: 'test2@test.com',
                        roles: ['subscriber'],
                    }
                ]
            }
        });

        jest.spyOn(emails, 'sendBulkEmails').mockRestore();

        const mockMailersendBulkSend = jest.spyOn(emails, 'mailersendBulkSend').mockResolvedValue();

        const result = await processNotifications();

        expect(result).toBe(1);

        const expectedNewIncidentEntry = {
            incidentId: "1",
            incidentTitle: "Incident 1",
            incidentUrl: "http://localhost:8000/cite/1",
            incidentDescription: "Incident 1 description",
            incidentDate: formatDate(incidents[0].date),
            reportImageUrl: "image_url",
            deployers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
            developers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
            entitiesHarmed: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
            implicatedSystems: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
        };

        expect(mockMailersendBulkSend.mock.calls).toHaveLength(1);
        expect(mockMailersendBulkSend.mock.calls[0][0]).toHaveLength(2);

        expect(mockMailersendBulkSend.mock.calls[0][0][0]).toMatchObject({
            from: {
                email: config.NOTIFICATIONS_SENDER,
                name: config.NOTIFICATIONS_SENDER_NAME,
            },
            to: [{ email: "test@test.com", name: undefined }],
            subject: "AI Incident Database: 1 new incident",
            html: templates.Notifications,
            personalization: [
                {
                    email: "test@test.com",
                    data: {
                        newIncidents: [expectedNewIncidentEntry],
                        entityEvents: [],
                        incidentUpdates: [],
                        submissionsPromoted: [],
                        email: "test@test.com",
                        userId: "5f8f4b3b9b3e6f001f3b3b3b",
                        siteUrl: "http://localhost:8000",
                    },
                },
            ],
        });

        expect(mockMailersendBulkSend.mock.calls[0][0][1]).toMatchObject({
            from: {
                email: config.NOTIFICATIONS_SENDER,
                name: config.NOTIFICATIONS_SENDER_NAME,
            },
            to: [{ email: "test2@test.com", name: undefined }],
            subject: "AI Incident Database: 1 new incident",
            html: templates.Notifications,
            personalization: [
                {
                    email: "test2@test.com",
                    data: {
                        newIncidents: [expectedNewIncidentEntry],
                        entityEvents: [],
                        incidentUpdates: [],
                        submissionsPromoted: [],
                        email: "test2@test.com",
                        userId: "5f8f4b3b9b3e6f001f3b3b3c",
                        siteUrl: "http://localhost:8000",
                    },
                },
            ],
        });
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
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
            },
            {
                type: 'incident',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "5f8f4b3b9b3e6f001f3b3b3b",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: Partial<DBIncident>[] = [
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
            },
            auth: {
                users: [
                    {
                        _id: new ObjectId('5f8f4b3b9b3e6f001f3b3b3b'),
                        email: 'test@test.com',
                        roles: ['admin'],
                    }
                ]
            }
        });


        mockSession('5f8f4b3b9b3e6f001f3b3b3b');


        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockImplementation(() => {
            throw new Error('Failed to send email');
        });

        const expectedErrorMessage = "[Process Pending Notifications]: Failed to send email";
        await expect(processNotifications()).rejects.toThrow(expectedErrorMessage);

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
                userId: '4a3f9c0d5e7b8a1c2d3e4f60', // Random user id that doesn't exist
            },
            {
                type: 'incident',
                userId: '4a3f9c0d5e7b8a1c2d3e4f60',
                incident_id: 1,
            },
            {
                type: 'submission-promoted',
                userId: '4a3f9c0d5e7b8a1c2d3e4f60',
                incident_id: 1,
            }
        ]

        const users: DBUser[] = [
            {
                userId: "4a3f9c0d5e7b8a1c2d3e4f60",
                roles: ['admin'],
            }
        ]

        const entities: DBEntity[] = [
            {
                entity_id: 'entity-1',
                name: 'Entity 1',
            }
        ]

        const incidents: Partial<DBIncident>[] = [
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

        mockSession('4a3f9c0d5e7b8a1c2d3e4f60');

        // No recipients
        jest.spyOn(userCacheManager.UserCacheManager.prototype, 'getUserAdminData').mockResolvedValue(null);

        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockImplementation(() => {
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

    // The data shape sent to MailerSend is asserted above; these tests exercise the
    // consolidated Notifications template itself, rendering it with nunjucks the same
    // way process-briefing-notifications.spec.ts does for the briefing template.
    it('Notifications template renders every populated digest section', () => {

        const digest = {
            newIncidents: [
                {
                    incidentId: '741',
                    incidentTitle: 'Test New Incident',
                    incidentUrl: config.SITE_URL + '/cite/741',
                    incidentDescription: 'A new incident description.',
                    incidentDate: 'October 2, 2023',
                    reportImageUrl: config.SITE_URL + '/img/incident-741.jpg',
                    editorNotes: 'Curated editor note for 741.',
                    developers: `<a href="${config.SITE_URL}/entities/openai">OpenAI</a>`,
                    deployers: `<a href="${config.SITE_URL}/entities/acme">Acme</a>`,
                    entitiesHarmed: `<a href="${config.SITE_URL}/entities/the-public">The Public</a>`,
                    implicatedSystems: `<a href="${config.SITE_URL}/entities/gpt-4">GPT-4</a>`,
                },
            ],
            entityEvents: [
                {
                    incidentId: '742',
                    incidentTitle: 'Entity Incident',
                    incidentUrl: config.SITE_URL + '/cite/742',
                    incidentDescription: 'An entity-related incident.',
                    incidentDate: 'October 3, 2023',
                    reportImageUrl: config.SITE_URL + '/img/incident-742.jpg',
                    developers: '',
                    deployers: '',
                    entitiesHarmed: '',
                    implicatedSystems: '',
                    entityName: 'OpenAI',
                    entityUrl: config.SITE_URL + '/entities/openai',
                    isUpdate: false,
                },
            ],
            incidentUpdates: [
                {
                    incidentId: '1',
                    incidentTitle: 'Followed Incident',
                    incidentUrl: config.SITE_URL + '/cite/1',
                    reportUrl: config.SITE_URL + '/cite/1#r2172',
                    reportTitle: 'A Newly Added Report',
                    reportAuthor: 'Jane Doe',
                },
            ],
            submissionsPromoted: [
                {
                    incidentId: '743',
                    incidentTitle: 'Promoted Submission',
                    incidentUrl: config.SITE_URL + '/cite/743',
                    incidentDescription: 'Your submission is now an incident.',
                    incidentDate: 'November 15, 2023',
                    reportImageUrl: config.SITE_URL + '/img/incident-743.jpg',
                },
            ],
        };

        const html = nunjucks.renderString(templates.Notifications, digest);

        // All four section headers render (with item counts) when populated.
        expect(html).toContain('New Incidents (1)');
        expect(html).toContain('Entity Updates (1)');
        expect(html).toContain('Updates to Incidents You Follow (1)');
        expect(html).toContain('Your Approved Submissions (1)');

        // Hidden preheader (inbox preview) and the unsubscribe footer.
        expect(html).toContain('The latest incidents and updates from the AI Incident Database');
        expect(html).toContain('Manage your subscriptions or unsubscribe');

        // Per-incident lead image.
        expect(html).toContain(`src="${config.SITE_URL}/img/incident-741.jpg"`);

        // Editor notes (New Incidents only) and implicated systems render when present.
        expect(html).toContain('Editor Notes');
        expect(html).toContain('Curated editor note for 741.');
        expect(html).toContain('AI systems implicated');

        // Incident links come from literal template markup, so they survive regardless
        // of how the rendering engine escapes data-driven values.
        expect(html).toContain(`href="${config.SITE_URL}/cite/741"`);
        expect(html).toContain('Incident 741: Test New Incident');

        // Conditional branches render correctly.
        expect(html).toContain('A new incident involving'); // entityEvents, isUpdate === false
        expect(html).toContain('A new report was added to'); // incidentUpdates carrying a report
        expect(html).toContain(`href="${config.SITE_URL}/cite/1#r2172"`);
        expect(html).toContain('by Jane Doe');
        expect(html).toContain('Your submission has been approved!');

        // Entity names are present. NOTE: the surrounding <a> tags in developers/deployers/
        // entitiesHarmed may be escaped depending on the engine — whether MailerSend renders
        // that HTML as links is engine-specific and is verified with a live send via
        // src/scripts/sendEmailTest.ts.
        expect(html).toContain('OpenAI');
    });

    it('Notifications template hides sections with no items', () => {

        // A user matched by only one notification type is still sent every array, exactly
        // as emptyDigest() produces. Empty arrays are truthy in nunjucks (and in Liquid), so
        // a bare `{% if section %}` would emit a lonely header for each unused section; the
        // `|length > 0` guard must keep them out of the email.
        const digest = {
            newIncidents: [
                {
                    incidentId: '741',
                    incidentTitle: 'Only New Incident',
                    incidentUrl: config.SITE_URL + '/cite/741',
                    incidentDescription: 'desc',
                    incidentDate: '2023-10-02',
                    reportImageUrl: '', // a report with no image stores image_url: '' (server/fields/reports.ts)
                    developers: '',
                    deployers: '',
                    entitiesHarmed: '',
                    implicatedSystems: '',
                },
            ],
            entityEvents: [],
            incidentUpdates: [],
            submissionsPromoted: [],
        };

        const html = nunjucks.renderString(templates.Notifications, digest);

        expect(html).toContain('New Incidents (1)');
        expect(html).not.toContain('Entity Updates');
        expect(html).not.toContain('Updates to Incidents You Follow');
        expect(html).not.toContain('Your Approved Submissions');

        // An empty (or missing) image_url is falsy, so no incident <img> is emitted — the card
        // renders without an image rather than a broken icon or placeholder. (The AIID header
        // logo uses alt="AIID", so it is unaffected by this assertion.)
        expect(html).not.toContain('alt="Incident image"');
    });
});
