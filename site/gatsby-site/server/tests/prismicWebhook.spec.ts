import { expect as playwrightExpect } from '@playwright/test';
import { expect as jestExpect } from '@jest/globals';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const { handler } = require('../../netlify/functions/prismicWebhook');

describe('Prismic Webhook Function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.post.mockResolvedValue({ data: { message: 'Mocked GitHub response' } });
    });

    test('Should reject non-POST requests', async () => {
        const event = {
            httpMethod: 'GET',
            body: JSON.stringify({
                secret: process.env.PRISMIC_SECRET,
            }),
            headers: {
                environment: 'production'
            }
        };

        const response = await handler(event);

        playwrightExpect(response.statusCode).toBe(405);
        playwrightExpect(JSON.parse(response.body).error).toBe('Method not allowed');
    });

    test('Should reject invalid secret', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                secret: 'invalid-secret',
            }),
            headers: {
                environment: 'production'
            }
        };

        const response = await handler(event);

        playwrightExpect(response.statusCode).toBe(401);
        playwrightExpect(JSON.parse(response.body).error).toBe('Unauthorized: Invalid secret');
    });

    test('Should reject invalid environment', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                secret: process.env.PRISMIC_SECRET,
            }),
            headers: {
                environment: 'invalid-environment'
            }
        };

        const response = await handler(event);

        playwrightExpect(response.statusCode).toBe(400);
        playwrightExpect(JSON.parse(response.body).error).toBe('Invalid environment specified');
    });

    test('Should reject missing PRISMIC_SECRET', async () => {
        const PRISMIC_SECRET_TEST = process.env.PRISMIC_SECRET;
        process.env.PRISMIC_SECRET = '';
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                secret: 'invalid-secret',
            }),
            headers: {
                environment: 'staging'
            }
        };

        const response = await handler(event);

        playwrightExpect(response.statusCode).toBe(500);
        playwrightExpect(JSON.parse(response.body).error).toBe('Server misconfiguration: PRISMIC_SECRET is not set.');
        process.env.PRISMIC_SECRET = PRISMIC_SECRET_TEST;
    });

    test('Should successfully trigger GitHub action for production', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                secret: process.env.PRISMIC_SECRET,
            }),
            headers: {
                environment: 'production'
            }
        };

        const response = await handler(event);

        playwrightExpect(response.statusCode).toBe(200);
        playwrightExpect(JSON.parse(response.body).success).toBe('GitHub Action triggered successfully!');
        jestExpect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/actions/workflows/production.yml/dispatches'),
            expect.objectContaining({
                inputs: { 'skip-cache': true },
                ref: 'main'
            }),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': expect.stringContaining('Bearer'),
                    'Accept': 'application/vnd.github.everest-preview+json'
                })
            })
        );
    });

    test('Should successfully trigger GitHub action for staging', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                secret: process.env.PRISMIC_SECRET,
            }),
            headers: {
                environment: 'staging'
            }
        };

        const response = await handler(event);

        playwrightExpect(response.statusCode).toBe(200);
        playwrightExpect(JSON.parse(response.body).success).toBe('GitHub Action triggered successfully!');
        jestExpect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/actions/workflows/staging.yml/dispatches'),
            expect.objectContaining({
                inputs: { 'skip-cache': true },
                ref: 'staging'
            }),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': expect.stringContaining('Bearer'),
                    'Accept': 'application/vnd.github.everest-preview+json'
                })
            })
        );
    });

    test('Should handle GitHub API errors', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('GitHub API error'));

        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({
                secret: process.env.PRISMIC_SECRET,
            }),
            headers: {
                environment: 'production'
            }
        };

        const response = await handler(event);

        playwrightExpect(response.statusCode).toBe(500);
        playwrightExpect(JSON.parse(response.body).error).toBe('Failed to trigger GitHub Action.');
    });
});