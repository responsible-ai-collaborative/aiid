import { expect } from '@playwright/test';
import { test } from '../utils';
import config from '../config';

test.describe('/api/lookupbyurl endpoint with production data', () => {
    test('Should fetch matching incidents and reports for Kronos/Starbucks case', async ({ request, baseURL }) => {
        const url1 = 'https://searchhrsoftware.techtarget.com/news/4500252451/Kronos-shift-scheduling-software-a-grind-for-Starbucks-worker';
        const url2 = 'https://www.nytimes.com/interactive/2014/08/13/us/starbucks-workers-scheduling-hours.html';
        const url3 = 'https://noresults.com/none';

        const query = [url1, url2, url3].map((url) => `urls[]=${encodeURIComponent(url)}`).join('&');
        const apiUrl = `${baseURL}/api/lookupbyurl?${query}`;

        const response = await request.get(apiUrl);
        const responseBody = await response.json();

        expect(responseBody).toEqual({
            results: [
                {
                    url: url1,
                    reports: [
                        {
                            report_number: 17,
                            title: "Kronos shift scheduling software a grind for Starbucks worker",
                            url: url1,
                        },
                    ],
                    incidents: [
                        {
                            incident_id: 10,
                            title: "Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees",
                            url: `${config.SITE_URL}/cite/10`,
                        },
                    ],
                },
                {
                    url: url2,
                    reports: [
                        {
                            report_number: 16,
                            title: "Working Anything but 9 to 5",
                            url: url2,
                        },
                    ],
                    incidents: [
                        {
                            incident_id: 10,
                            title: "Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees",
                            url: `${config.SITE_URL}/cite/10`,
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
    });
}); 