import { expect, jest, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer } from "./utils";
import * as common from '../fields/common';
import * as emails from '../emails';
import { DBEntity, DBIncident, DBNotification, DBReport, DBSubscription, DBUser } from '../interfaces';
import config from '../config';
import { ObjectId } from 'bson';
import templates from '../emails/templates';
import { replacePlaceholdersWithAllowedKeys } from '../emails';
import { processWeeklyNotifications } from '../../src/scripts/process-weekly-notifications';
import * as prismic from '@prismicio/client';
import { processNotifications } from '../../src/scripts/process-notifications';

jest.mock('@prismicio/client', () => ({
  createClient: jest.fn().mockReturnValue({
    getAllByType: jest.fn(),
  }),
  filter: {
    dateAfter: jest.fn(),
  },
}));

describe(`Weekly Notifications`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });

    it(`Should use bulk email API`, async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'ai-weekly-briefing',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'ai-weekly-briefing',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
            },
            {
                type: 'ai-weekly-briefing',
                userId: '5f8f4b3b9b3e6f001f3b3b3c',
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

        // Mock both blog and update queries to return empty arrays by default
        const mockGetAllByType = jest.fn().mockImplementation((documentType) => {
          if (documentType === 'blog') {
            return Promise.resolve([] as any);
          }
          if (documentType === 'update') {
            return Promise.resolve([] as any);
          }
          return Promise.resolve([]);
        });

        (prismic.createClient as jest.Mock).mockReturnValue({
          getAllByType: mockGetAllByType
        });


        jest.spyOn(emails, 'sendBulkEmails').mockRestore();

        const mockMailersendBulkSend = jest.spyOn(emails, 'mailersendBulkSend').mockResolvedValue();

        const result = await processWeeklyNotifications();

        expect(result).toBe(1);

        expect(mockMailersendBulkSend.mock.calls[0][0][0]).toMatchObject({
            from: {
                email: config.NOTIFICATIONS_SENDER,
                name: config.NOTIFICATIONS_SENDER_NAME,
            },
            to: [
                {
                    email: "test@test.com",
                    name: undefined,
                },
            ],
            cc: undefined,
            bcc: undefined,
            reply_to: undefined,
            in_reply_to: undefined,
            subject: "Your Weekly AI Incident Briefing",
            text: undefined,
            html: replacePlaceholdersWithAllowedKeys(templates.AIIncidentBriefing, {
                // deployers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                // developers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                // entitiesHarmed: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                // implicatedSystems: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
            }, ['developers', 'deployers', 'entitiesHarmed', 'implicatedSystems']),
            send_at: undefined,
            attachments: undefined,
            template_id: undefined,
            tags: undefined,
            personalization: [
                {
                    email: "test@test.com",
                    data: {
                        // incidentId: "1",
                        // incidentTitle: "Incident 1",
                        // incidentUrl: "http://localhost:8000/cite/1",
                        // incidentDescription: "Incident 1 description",
                        // incidentDate: incidents[0].date,
                        // deployers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        // developers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        // entitiesHarmed: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        email: "test@test.com",
                        userId: "5f8f4b3b9b3e6f001f3b3b3b",
                        siteUrl: "http://localhost:8000",
                        // implicatedSystems: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
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
                    name: undefined,
                },
            ],
            cc: undefined,
            bcc: undefined,
            reply_to: undefined,
            in_reply_to: undefined,
            subject: "Your Weekly AI Incident Briefing",
            text: undefined,
            html: replacePlaceholdersWithAllowedKeys(templates.AIIncidentBriefing, {
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
                        // incidentId: "1",
                        // incidentTitle: "Incident 1",
                        // incidentUrl: "http://localhost:8000/cite/1",
                        // incidentDescription: "Incident 1 description",
                        // incidentDate: incidents[0].date,
                        // deployers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        // developers: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        // entitiesHarmed: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
                        email: "test2@test.com",
                        userId: "5f8f4b3b9b3e6f001f3b3b3c",
                        siteUrl: "http://localhost:8000",
                        // implicatedSystems: "<a href=\"http://localhost:8000/entities/entity-1\">Entity 1</a>",
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
                type: 'ai-weekly-briefing',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'ai-weekly-briefing',
                userId: '5f8f4b3b9b3e6f001f3b3b3b',
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



        // Mock both blog and update queries to return empty arrays by default
        const mockGetAllByType = jest.fn().mockImplementation((documentType) => {
          if (documentType === 'blog') {
            return Promise.resolve([] as any);
          }
          if (documentType === 'update') {
            return Promise.resolve([] as any);
          }
          return Promise.resolve([]);
        });

        (prismic.createClient as jest.Mock).mockReturnValue({
          getAllByType: mockGetAllByType
        });

        mockSession('5f8f4b3b9b3e6f001f3b3b3b');

        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockImplementation(() => {
            throw new Error('Failed to send email');
        });

        const expectedErrorMessage = "[Process Weekly Notifications: AI Incident Briefing]: Failed to send email";
        await expect(processWeeklyNotifications()).rejects.toThrow(expectedErrorMessage);

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
                type: 'ai-weekly-briefing',
                incident_id: 1,
                processed: false,
            },
        ]);
    });



    it(`processNotifications mutation - notifications for weekly ai briefings`, async () => {

      const notifications: DBNotification[] = [
        {
          processed: false,
          type: 'ai-weekly-briefing',
          incident_id: 1,
        },
      ]

      const subscriptions: DBSubscription[] = [
        {
          type: 'ai-weekly-briefing',
          userId: '5f8f4b3b9b3e6f001f3b3b3b',
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
        },
        auth: {
          users: authUsers,
        }
      });

      const mockBlogPosts = [
        {
          data: {
            slug: 'example-blog-post',
            title: [{ text: 'Example Blog Post' }],
            metaDescription: [{ text: 'This is an example blog post description.' }],
            date: '2023-10-01'
          }
        }
      ];

      const mockUpdates = [
        {
          data: {
            title: 'Example Update',
            text: [{ text: 'Example Update' }],
          }
        }
      ];
    
      // Mock both blog and update queries to return empty arrays by default
      const mockGetAllByType = jest.fn().mockImplementation((documentType) => {
        if (documentType === 'blog') {
          return Promise.resolve(mockBlogPosts as any);
        }
        if (documentType === 'update') {
          return Promise.resolve(mockUpdates as any);
        }
        return Promise.resolve([]);
      });

      (prismic.createClient as jest.Mock).mockReturnValue({
        getAllByType: mockGetAllByType
      });

      mockSession('5f8f4b3b9b3e6f001f3b3b3b');

      const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockResolvedValue();

      const result = await processWeeklyNotifications();

      expect(sendEmailMock).toHaveBeenCalledTimes(1);
      expect(sendEmailMock).nthCalledWith(1, expect.objectContaining({
        recipients: [
          {
            email: "test@test.com",
            userId: "5f8f4b3b9b3e6f001f3b3b3b",
          },
        ],
        subject: "Your Weekly AI Incident Briefing",
        dynamicData: {
          newIncidents: [
            {
              id: 1,
              title: "Incident 1",
              url: config.SITE_URL + "/cite/1",
              description: "Incident 1 description",
              date: incidents[0].date,
              developers: "",
              deployers: "",
              entitiesHarmed: "",
              implicatedSystems: "",
            }],
          newBlogPosts: [{
            "date": "2023-10-01",
            "description": "This is an example blog post description.",
            "title": "Example Blog Post",
            "url": config.SITE_URL + "/blog/example-blog-post"
          }],
          updates: [{
            "description": "Example Update",
            "title": "Example Update"
          }]
        },
        templateId: "AIIncidentBriefing",
      }));

      expect(result).toBe(1);
    });

    it('Should not crash if no recipients found', async () => {

        const notifications: DBNotification[] = [
            {
                processed: false,
                type: 'ai-weekly-briefing',
                incident_id: 1,
            },
        ]

        const subscriptions: DBSubscription[] = [
            {
                type: 'ai-weekly-briefing',
                userId: '5f8f4b3b9b3e6f001f3b3b3c',
            }
        ]

        const users: DBUser[] = [
            {
                userId: "5f8f4b3b9b3e6f001f3b3b3c",
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

        // Mock both blog and update queries to return empty arrays by default
        const mockGetAllByType = jest.fn().mockImplementation((documentType) => {
          if (documentType === 'blog') {
            return Promise.resolve([] as any);
          }
          if (documentType === 'update') {
            return Promise.resolve([] as any);
          }
          return Promise.resolve([]);
        });

        (prismic.createClient as jest.Mock).mockReturnValue({
          getAllByType: mockGetAllByType
        });

        mockSession('5f8f4b3b9b3e6f001f3b3b3c');

        // No recipients
        jest.spyOn(common, 'getUserAdminData').mockResolvedValue(null);

        const sendEmailMock = jest.spyOn(emails, 'sendBulkEmails').mockImplementation(() => {
            throw new Error('Failed to send email');
        });


        await processWeeklyNotifications();

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
                type: 'ai-weekly-briefing',
                incident_id: 1,
                processed: true
            },
        ]);
    });
    
});
