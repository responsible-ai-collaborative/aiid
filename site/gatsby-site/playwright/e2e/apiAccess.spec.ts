import { expect } from '@playwright/test';
import { gql } from '@apollo/client';
import { query, test, testUser } from '../utils';
import * as memoryMongo from '../memory-mongo';
import {
  API_ACCESS_BLOCKED,
  API_LOGIN_REQUIRED,
  API_LOGIN_REQUIRED_MESSAGE,
} from '../../server/apiAccessCodes';

/**
 * End-to-end coverage for the API access requirement.
 * SEE: site/docs/API_ACCESS.md
 *
 * The unit-level rules live in `server/tests/apiAccess.spec.ts`. What these tests
 * add is the part that can only be checked in a browser: that a logged-out
 * visitor is given the reason *in place* on a real page rather than a spinner, a
 * blank region or a redirect — and that logging in restores the feature.
 */

const NOTICE = '[data-cy="api-login-required"]';

test.describe('API access requires a login', () => {
  test('the endpoint refuses an anonymous query with the login-required code', async ({ page }) => {
    const response = await page.request.post('/api/graphql', {
      data: { query: '{ reports(pagination: {limit: 1, skip: 0}) { report_number } }' },
      headers: { 'content-type': 'application/json' },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.errors[0].message).toBe(API_LOGIN_REQUIRED_MESSAGE);
    expect(body.errors[0].extensions.code).toBe(API_LOGIN_REQUIRED);
  });

  test('the endpoint answers the same query once a session is supplied', async ({ login }) => {
    const [, accessToken] = await login();

    const { data } = await query(
      {
        query: gql`
          query {
            reports(pagination: { limit: 1, skip: 0 }) {
              report_number
            }
          }
        `,
      },
      { Cookie: `next-auth.session-token=${encodeURIComponent(accessToken)};` }
    );

    expect(data.reports.length).toBeGreaterThan(0);
  });

  test('schema introspection stays reachable, so the explorer loads while logged out', async ({
    page,
  }) => {
    const response = await page.request.post('/api/graphql', {
      data: { query: '{ __schema { queryType { name } } }' },
      headers: { 'content-type': 'application/json' },
    });

    expect(response.status()).toBe(200);

    expect((await response.json()).data.__schema.queryType.name).toBe('Query');
  });

  test('the submit form shows the reason instead of the form, and the form after logging in', async ({
    page,
    login,
  }) => {
    await page.goto('/apps/submit/');

    // The heading is deliberately kept, so the visitor can see they reached the
    // right page. SEE: src/components/forms/SubmitForm.js
    await expect(page.locator('[data-cy="submit-form-title"]')).toBeVisible();

    await expect(page.locator(NOTICE)).toContainText('requires that you log in to the database');

    await login();

    await page.goto('/apps/submit/');

    await expect(page.locator(NOTICE)).not.toBeVisible();

    await expect(page.locator('[data-cy="submit-form-title"]')).toBeVisible();
  });

  test('the incidents table is readable without a login and only live data is gated', async ({
    page,
    login,
  }) => {
    // The tables on this page come from build-time data, so gating the whole page
    // would have withdrawn something that never needed the API. Only the "Show Live
    // data" toggle does. SEE: src/pages/apps/incidents.js
    await page.goto('/apps/incidents/');

    await expect(page.locator('table tbody tr').first()).toBeVisible();

    const liveSwitch = page.locator('input[name="live-data-switch"]');

    await expect(liveSwitch).toBeDisabled();

    // The reason sits next to the control it applies to, rather than over the page.
    await expect(page.locator(NOTICE)).toBeVisible();

    await login();

    await page.goto('/apps/incidents/');

    await expect(page.locator('table tbody tr').first()).toBeVisible();

    await expect(page.locator('input[name="live-data-switch"]')).toBeEnabled();

    await expect(page.locator(NOTICE)).not.toBeVisible();
  });

  test('the discover flag action explains the requirement only when opened', async ({
    page,
    login,
  }) => {
    // `Modal` renders its children even while closed, so the body is instantiated
    // once per search hit. Nothing may be requested — or shown — until the visitor
    // actually opens one. SEE: src/components/discover/Actions.js
    await page.goto('/apps/discover/');

    await expect(page.locator('[data-cy="flag-button"]').first()).toBeVisible();

    await expect(page.locator(NOTICE)).not.toBeVisible();

    await page.locator('[data-cy="flag-button"]').first().click();

    await expect(page.locator(NOTICE)).toBeVisible();

    // Logged in, the same modal offers the action itself.
    await login();

    await page.goto('/apps/discover/');

    await page.locator('[data-cy="flag-button"]').first().click();

    await expect(page.locator('[data-cy="flag-toggle"]')).toBeVisible();

    await expect(page.locator(NOTICE)).not.toBeVisible();
  });

  test('a statically built incident page still renders for a logged-out visitor', async ({
    page,
  }) => {
    // The requirement applies to the API, not to browsing: incident pages are
    // built from MongoDB at build time, so gating the API must not have made
    // the public site require a login. SEE: site/docs/API_ACCESS.md
    await page.goto('/cite/1/');

    await expect(page.locator('h1').first()).toBeVisible();

    await expect(page.getByText('Incident 1')).toBeTruthy();
  });

  test('an incident page raises no uncaught error while logged out', async ({ page }) => {
    // Regression test. `Taxonomy` mounts `TaxonomyForm` for every taxonomy card on
    // every incident page, and that form used to fetch entities on mount --
    // unconditionally, and with no rejection handler -- whenever the taxonomy had
    // `complete_entities`. Once the API required a login, the refusal surfaced as an
    // uncaught Apollo error on the page. It reproduced only on incidents whose
    // taxonomy sets that flag, which is why one sampled incident page was not
    // sufficient coverage. SEE: src/components/taxa/TaxonomyForm.js
    const pageErrors = [];

    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto('/cite/1/');

    await page.waitForLoadState('networkidle').catch(() => {});

    expect(pageErrors).toEqual([]);

    // The statically built content is still there for a logged-out visitor.
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('the variant form on an incident page asks for a login only once opened', async ({
    page,
  }) => {
    await page.goto('/cite/1/');

    // No standing banner: the notice appears at the moment the visitor asks for
    // the feature. SEE: src/components/variants/VariantList.js
    await expect(page.locator(NOTICE)).not.toBeVisible();

    await page.locator('[data-cy="add-variant-btn"]').click();

    await expect(page.locator(NOTICE)).toBeVisible();
  });

  test('a checklist opened by id shows the reason rather than spinning', async ({ page }) => {
    await page.goto('/apps/checklists/?id=fakeChecklist1');

    await expect(page.locator(NOTICE)).toBeVisible();
  });

  test('the admin page tells a logged-out visitor to log in, not that they lack a role', async ({
    page,
  }) => {
    await page.goto('/admin/');

    await expect(page.locator(NOTICE)).toBeVisible();

    await expect(page.getByText('Not enough permissions')).not.toBeVisible();
  });
});

test.describe('Blocking an account', () => {
  test.afterEach(async () => {
    await memoryMongo.execute(async (client) => {
      await client
        .db('customData')
        .collection('users')
        .updateMany(
          {},
          {
            $unset: {
              api_access_blocked: '',
              api_access_blocked_at: '',
              api_access_blocked_reason: '',
            },
          }
        );
    });
  });

  test('a blocked account is refused with its reason', async ({ login }) => {
    const [userId, accessToken] = await login();

    await memoryMongo.execute(async (client) => {
      await client
        .db('customData')
        .collection('users')
        .updateOne(
          { userId },
          {
            $set: {
              api_access_blocked: true,
              api_access_blocked_at: new Date(),
              api_access_blocked_reason: 'Automated scraping',
            },
          }
        );
    });

    // The gate caches the flag per process for 15s (SEE: server/apiAccess.ts),
    // so the assertion is retried until the block is observed rather than
    // asserted once against a warm cache.
    await expect(async () => {
      let error: any = null;

      try {
        await query(
          {
            query: gql`
              query {
                reports(pagination: { limit: 1, skip: 0 }) {
                  report_number
                }
              }
            `,
          },
          { Cookie: `next-auth.session-token=${encodeURIComponent(accessToken)};` }
        );
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();

      const denial = (error.graphQLErrors ?? [])
        .concat(error.networkError?.result?.errors ?? [])
        .find((e: any) => e?.extensions?.code === API_ACCESS_BLOCKED);

      expect(denial).toBeTruthy();
      expect(denial.extensions.reason).toBe('Automated scraping');
    }).toPass({ timeout: 30000 });
  });

  test('an admin sees the block state and usage of an account, and can block it', async ({
    page,
    login,
  }) => {
    await login({ email: testUser.email, customData: { roles: ['admin'] } });

    await page.goto('/admin/');

    await expect(page.locator('[data-cy="api-access-blocked-badge"]')).not.toBeVisible();

    await page.locator('[data-cy="edit-user-button"]').first().click();

    // Usage is shown next to the control, so the decision to block is made with
    // the volume in view. SEE: src/components/users/UserEditModal.js
    await expect(page.locator('[data-cy="api-usage-summary"]')).toBeVisible();

    await page.locator('[data-cy="api-access-blocked"]').check();

    await page.locator('[data-cy="api-access-blocked-reason"]').fill('Automated scraping');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('[data-cy="api-access-blocked-badge"]').first()).toBeVisible();
  });
});
