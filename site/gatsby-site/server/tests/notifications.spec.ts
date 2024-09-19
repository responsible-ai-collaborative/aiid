import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, seedFixture, startTestServer } from "./utils";
import * as context from '../context';
import * as common from '../fields/common';
import { DBEntity, DBIncident, DBNotification, DBReport, DBSubscription, DBUser } from '../interfaces';
import config from '../config';

describe(`Notifications`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`processNotifications mutation - shouldn't send anything`, async () => {

        const mutationData = {
            query: `
                mutation {
                    processNotifications
                }
            `,
        };


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


        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        const sendEmailMock = jest.spyOn(common, 'sendEmail').mockResolvedValue({});

        const response = await makeRequest(url, mutationData, { ['PROCESS_NOTIFICATIONS_SECRET']: config.PROCESS_NOTIFICATIONS_SECRET });

        expect(response.body.data).toMatchObject({ processNotifications: 0 })
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

        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ email: 'test@test.com' });
        const sendEmailMock = jest.spyOn(common, 'sendEmail').mockResolvedValue({});

        const response = await makeRequest(url, mutationData, { ['PROCESS_NOTIFICATIONS_SECRET']: config.PROCESS_NOTIFICATIONS_SECRET });;

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
                incidentUrl: "https://incidentdatabase.ai/cite/1",
                incidentDescription: "Incident 1 description",
                incidentDate: incidents[0].date,
                developers: "",
                deployers: "",
                entitiesHarmed: "",
            },
            templateId: "NewIncident",
        }));
        expect(response.body.data).toMatchObject({ processNotifications: 1 });
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

        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ email: 'test@test.com' });
        const sendEmailMock = jest.spyOn(common, 'sendEmail').mockResolvedValue({});

        const response = await makeRequest(url, mutationData, { ['PROCESS_NOTIFICATIONS_SECRET']: config.PROCESS_NOTIFICATIONS_SECRET });;

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
                incidentUrl: "https://incidentdatabase.ai/cite/1",
                incidentDescription: "Incident 1 description",
                incidentDate: incidents[0].date,
                entityName: "Entity 1",
                entityUrl: "https://incidentdatabase.ai/entities/entity-1",
                developers: "",
                deployers: "",
                entitiesHarmed: "",
            },
            templateId: "NewEntityIncident",
        }));
        expect(response.body.data).toMatchObject({ processNotifications: 1 });
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

        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ email: 'test@test.com' });
        const sendEmailMock = jest.spyOn(common, 'sendEmail').mockResolvedValue({});

        const response = await makeRequest(url, mutationData, { ['PROCESS_NOTIFICATIONS_SECRET']: config.PROCESS_NOTIFICATIONS_SECRET });;

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
                incidentUrl: "https://incidentdatabase.ai/cite/1",
                reportUrl: "https://incidentdatabase.ai/cite/1#r1",
                reportTitle: "Report 1",
                reportAuthor: "",
            },
            templateId: "NewReportAddedToAnIncident",
        }));
        expect(response.body.data).toMatchObject({ processNotifications: 1 });
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

        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ email: 'test@test.com' });
        const sendEmailMock = jest.spyOn(common, 'sendEmail').mockResolvedValue({});

        const response = await makeRequest(url, mutationData, { ['PROCESS_NOTIFICATIONS_SECRET']: config.PROCESS_NOTIFICATIONS_SECRET });;

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
                incidentUrl: "https://incidentdatabase.ai/cite/1",
                reportUrl: "https://incidentdatabase.ai/cite/1#rundefined",
                reportTitle: "",
                reportAuthor: "",
            },
            templateId: "IncidentUpdate",
        }));
        expect(response.body.data).toMatchObject({ processNotifications: 1 });
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

        jest.spyOn(context, 'verifyToken').mockResolvedValue({ sub: "123" })
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue({ email: 'test@test.com' });
        const sendEmailMock = jest.spyOn(common, 'sendEmail').mockResolvedValue({});

        const response = await makeRequest(url, mutationData, { ['PROCESS_NOTIFICATIONS_SECRET']: config.PROCESS_NOTIFICATIONS_SECRET });;

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
                incidentUrl: "https://incidentdatabase.ai/cite/1",
                incidentDescription: "Incident 1 description",
                incidentDate: incidents[0].date,
            },
            templateId: "SubmissionApproved",
        }));
        expect(response.body.data).toMatchObject({ processNotifications: 1 });
    });
});
