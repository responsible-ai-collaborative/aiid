import { expect } from '@playwright/test';
import { gql } from '@apollo/client';
import { query, test } from '../../utils';
import { API_LOGIN_REQUIRED } from '../../../server/apiAccessCodes';

/**
 * The endpoint requires a logged-in account (SEE: server/apiAccess.ts and
 * site/docs/API_ACCESS.md). The anonymous case is asserted here by hand with
 * `page.request` because the shared `query()` helper authenticates by default.
 */
test.describe('/api/graphql endpoint', () => {

    test('Endpoint should refuse an anonymous query', async ({ page }) => {

        const response = await page.request.post('/api/graphql', {
            data: { query: '{ reports { title report_number } }' },
            headers: { 'content-type': 'application/json' },
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body.data).toEqual({ reports: null });
        expect(body.errors[0].extensions.code).toBe(API_LOGIN_REQUIRED);
    });

    test('Endpoint should work with a session', async ({ login }) => {

        const [, accessToken] = await login();

        const result = await query(
            {
                query: gql`
                    query {
                        reports {
                            title
                            report_number
                        }
                    }
                `,
            },
            { Cookie: `next-auth.session-token=${encodeURIComponent(accessToken)};` }
        );

        expect(result.data.reports).not.toBeNull();
    });

    test('Should fetch reports', async () => {

        const result = await query({
            query: gql`
                query {
                    reports {
                        title
                        report_number
                    }
                }
            `,
        });

        expect(result.data.reports.length).toBeGreaterThanOrEqual(8);
    });
});
