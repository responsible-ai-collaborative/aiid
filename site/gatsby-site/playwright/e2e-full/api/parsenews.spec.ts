import { test, expect } from '@playwright/test';

test.describe('/api/parseNews endpoint', () => {

    test('Should parse news', async ({ request, baseURL }) => {
        const newsUrl = 'https://incidentdatabase.ai/blog/improv-ai/';
        const apiUrl = `${baseURL}/api/parseNews?url=${encodeURIComponent(newsUrl)}`;

        await expect(async () => {
            const response = await request.get(apiUrl);
            const responseBody = await response.json();

            expect(response.status()).toBe(200);
            expect(responseBody.title).toBe('How to Understand Large Language Models through Improv');
        }).toPass();
    });
});