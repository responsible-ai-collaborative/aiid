import { expect } from '@playwright/test';
import { test } from '../../utils';

test.describe('/api/lookupbyurl endpoint', () => {

    async function runSuccessfulLookupTest(request, baseURL, paramName: string) {
        const url1 = 'https://searchhrsoftware.techtarget.com/news/4500252451/Kronos-shift-scheduling-software-a-grind-for-Starbucks-worker';
        const url2 = 'https://www.nytimes.com/interactive/2014/08/13/us/starbucks-workers-scheduling-hours.html';
        const url3 = 'https://noresults.com/none';

        const query = [url1, url2, url3].map((url) => `${paramName}=${encodeURIComponent(url)}`).join('&');
        const apiUrl = `${baseURL}/api/lookupbyurl?${query}`;

        const response = await request.get(apiUrl);
        const responseBody = await response.json();

        expect(responseBody).toEqual({
            results: [
                {
                    url: url1,
                    reports: [
                        {
                            report_number: 4,
                            title: "Kronos shift scheduling software a grind for Starbucks worker",
                            url: url1,
                        },
                        {
                            report_number: 9,
                            title: "Response Issue Report 9",
                            url: url1,
                        },
                    ],
                    incidents: [
                        {
                            incident_id: 3,
                            title: "Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees",
                            url: `${baseURL}/cite/3`,
                        },
                        {
                            incident_id: 4,
                            title: "Test title 4",
                            url: `${baseURL}/cite/4`,
                        },
                    ],
                },
                {
                    url: url2,
                    reports: [
                        {
                            report_number: 3,
                            title: "Working Anything but 9 to 5",
                            url: url2,
                        },
                    ],
                    incidents: [
                        {
                            incident_id: 3,
                            title: "Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees",
                            url: `${baseURL}/cite/3`,
                        },
                    ],
                },
                {
                    url: url3,
                    reports: [],
                    incidents: [],
                },
            ]
        });
    }

    test('Should fetch matching incidents and reports', async ({ request, baseURL }) => {
        await runSuccessfulLookupTest(request, baseURL, 'urls[]');
    });

    test('Should fetch matching incidents and reports using urls parameter without []', async ({ request, baseURL }) => {
        await runSuccessfulLookupTest(request, baseURL, 'urls');
    });

    test('Should throw 400', async ({ request, baseURL }) => {
        const url1 = 'badurl';
        const query = `urls[]=${encodeURIComponent(url1)}`;
        const apiUrl = `${baseURL}/api/lookupbyurl?${query}`;

        const response = await request.get(apiUrl, { failOnStatusCode: false });
        const responseBody = await response.json();

        expect(responseBody).toEqual({
            status: 400,
            errors: [
                {
                    path: 'urls.0',
                    errorCode: 'format.openapi.requestValidation',
                    message: 'must match format "url"',
                    location: 'query',
                },
            ],
        });
    });
});