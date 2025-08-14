import { expect, it } from '@jest/globals';
import { ApolloServer } from "@apollo/server";
import { makeRequest, mockSession, seedFixture, startTestServer } from "./utils";
import { DBIncident, DBReport } from '../interfaces';
import { IncidentFilterType, IncidentUpdateType, ReportInsertType } from '../generated/graphql';

describe(`History`, () => {
    let server: ApolloServer, url: string;

    beforeAll(async () => {
        ({ server, url } = await startTestServer());
    });

    afterAll(async () => {
        await server?.stop();
    });


    it(`Create history item when linking reports to incidents`, async () => {

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
            },
            {
                report_number: 2,
                title: 'Report 2',
                description: 'Report 2 description',
                authors: [],
                cloudinary_id: 'cloudinary_id',
                date_downloaded: new Date().toISOString(),
                date_modified: new Date().toISOString(),
                date_published: new Date().toISOString(),
                date_submitted: new Date().toISOString(),
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
                users: [
                    {
                        userId: "123",
                        roles: ['incident_editor'],
                    }
                ],
            },
            aiidprod: {
                incidents,
                reports,
            },
            history: {
                incidents: [],
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
                    incident_ids: [1],
                    report_numbers: [2]
                }
            }
        };


        mockSession('123');

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            linkReportsToIncidents: [
                {
                    incident_id: 1,
                    reports: [
                        {
                            report_number: 1,
                        },
                        {
                            report_number: 2,
                        },
                    ]
                }
            ]
        })

        const history = await makeRequest(url, {
            query: `
            query {
                 history_incidents {
                    _id
                    incident_id
                    title
                    description
                    reports
                    AllegedDeployerOfAISystem
                    AllegedHarmedOrNearlyHarmedParties
                    AllegedDeveloperOfAISystem
                    date
                    description
                    editor_dissimilar_incidents
                    editor_notes
                    editor_similar_incidents
                    editors
                    embedding {
                        from_reports
                        vector
                    }
                    flagged_dissimilar_incidents
                    tsne {
                        x
                        y
                    }
                    modifiedBy
                }
            }
            `});

        expect(history.body.data).toMatchObject({
            history_incidents:
                [
                    {
                        _id: expect.any(String),
                        reports: [1, 2],
                        title: incidents[0].title,
                        description: incidents[0].description,
                        date: incidents[0].date,
                        AllegedDeployerOfAISystem: incidents[0]["Alleged deployer of AI system"],
                        AllegedDeveloperOfAISystem: incidents[0]["Alleged developer of AI system"],
                        AllegedHarmedOrNearlyHarmedParties: incidents[0]["Alleged harmed or nearly harmed parties"],
                        modifiedBy: '123',
                    },
                ]
        });
    });

    it(`Create history item when flagging for dissimilarity`, async () => {

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
                flagged_dissimilar_incidents: [],
                implicated_systems: [],
            }
        ]


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
                incidents,
            },
            history: {
                incidents: [],
            },
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


        mockSession('123')

        const response = await makeRequest(url, mutationData);

        expect(response.body.data).toMatchObject({
            flagIncidentSimilarity: {
                incident_id: 1,
                flagged_dissimilar_incidents: [2],
            }
        })


        const history = await makeRequest(url, {
            query: `
            query {
                 history_incidents {
                    incident_id
                    flagged_dissimilar_incidents
                    modifiedBy
                }
            }
            `});

        expect(history.body.data).toMatchObject({
            history_incidents:
                [
                    {
                        incident_id: 1,
                        flagged_dissimilar_incidents: [2],
                        modifiedBy: '123',
                    },
                ]
        });

    });

    it(`Create history item when editing Incident`, async () => {

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
                incidents,
            },
            history: {
                incidents: [],
            },
        });

        const mutationData: { variables: { filter: IncidentFilterType, update: IncidentUpdateType }, query: string } = {
            query: `
            mutation($filter: IncidentFilterType!, $update: IncidentUpdateType!) {
                updateOneIncident(filter: $filter, update: $update) {
                    incident_id
                    title
                }
            }
            `,
            variables: {
                filter: { incident_id: { EQ: 1 } },
                update: {
                    set: {
                        title: 'Incident 1 updated',
                        description: 'Incident 1 description updated',
                    }
                }
            }
        };

        mockSession('123');

        await makeRequest(url, mutationData);


        const history = await makeRequest(url, {
            query: `
            query {
                 history_incidents {
                    incident_id
                    title
                    description
                    modifiedBy
                }
            }
            `});

        expect(history.body.data).toMatchObject({
            history_incidents:
                [
                    {
                        incident_id: 1,
                        title: 'Incident 1 updated',
                        description: 'Incident 1 description updated',
                        modifiedBy: '123',
                    },
                ]
        });
    });

    it(`Create history item when inserting Incident`, async () => {

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
                incidents: [],
            },
            history: {
                incidents: [],
            },
        });

        const mutationData = {
            query: `
            mutation($data: IncidentInsertType!) {
                insertOneIncident(data: $data) {
                    incident_id
                    title
                }
            }
            `,
            variables: {
                data: {
                    incident_id: 1,
                    title: "Test",
                    date: "2024-01-01",
                    editor_notes: "note",
                    flagged_dissimilar_incidents: []
                }
            }
        };

        mockSession('123');


        await makeRequest(url, mutationData);

        const history = await makeRequest(url, {
            query: `
            query {
                 history_incidents {
                    incident_id
                    title
                    modifiedBy
                }
            }
            `});

        expect(history.body.data).toMatchObject({
            history_incidents:
                [
                    {
                        incident_id: 1,
                        title: "Test",
                        modifiedBy: '123',
                    },
                ]
        });
    });

    it(`Create history item when editing a Report`, async () => {

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
                user: '123',
            }
        ];

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
                reports,
            },
            history: {
                reports: [],
            },
        });

        const mutationData = {
            query: `
            mutation($filter: ReportFilterType!, $update: ReportUpdateType!) {
                updateOneReport(filter: $filter, update: $update) {
                    report_number
                    title
                }
            }
            `,
            variables: {
                filter: { report_number: { EQ: 1 } },
                update: {
                    set: {
                        title: 'Report 1 updated',
                    }
                }
            }
        };

        mockSession('123');

        await makeRequest(url, mutationData);

        const history = await makeRequest(url, {
            query: `
            query {
                 history_reports {
                    report_number
                    title
                    modifiedBy
                }
            }
            `});

        expect(history.body.data).toMatchObject({
            history_reports:
                [
                    {
                        report_number: 1,
                        title: 'Report 1 updated',
                        modifiedBy: '123',
                    },
                ]
        });
    });

    it(`Create history item when inserting a Report`, async () => {

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
                reports: [],
            },
            history: {
                reports: [],
            },
        });

        const mutationData: { query: string, variables: { data: ReportInsertType } } = {
            query: `
            mutation($data: ReportInsertType!) {
                insertOneReport(data: $data) {
                    report_number
                    title
                }
            }
            `,
            variables: {
                data: {
                    report_number: 1,
                    title: "Test",
                    date_downloaded: new Date().toISOString(),
                    date_modified: new Date().toISOString(),
                    date_published: new Date().toISOString(),
                    date_submitted: new Date().toISOString(),
                    epoch_date_modified: 1,
                    epoch_date_published: 1,
                    epoch_date_submitted: 1,
                    image_url: 'image_url',
                    authors: [],
                    text: 'text',
                    cloudinary_id: 'cloudinary_id',
                    language: 'en',
                    plain_text: 'plain_text',
                    source_domain: 'source_domain',
                    submitters: [],
                    tags: [],
                    url: 'url',
                },
            },
        };

        mockSession('123');

        await makeRequest(url, mutationData);

        const history = await makeRequest(url, {
            query: `
            query {
                 history_reports {
                    report_number
                    title
                    modifiedBy
                }
            }
            `});

        expect(history.body.data).toMatchObject({
            history_reports:
                [
                    {
                        report_number: 1,
                        title: "Test",
                        modifiedBy: '123',
                    },
                ]
        });
    });
});
