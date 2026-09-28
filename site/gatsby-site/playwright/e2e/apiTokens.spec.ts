import { test, testUser } from '../utils';
import { expect } from '@playwright/test';
import { init } from '../memory-mongo';

// Every account carries an API token that stands in for the session on the API.
// SEE: server/apiTokens.ts, site/docs/API_ACCESS.md
test.describe('API tokens', () => {

  const graphql = (request: any, token: string | null, query: string) =>
    request.post('/api/graphql', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      data: { query },
    });

  test('The account page shows the token and it authenticates API requests without a session', async ({ page, request, login }) => {

    await init();

    await login();

    await page.goto('/account');

    const shown = (await page.locator('[data-cy="api-token-value"]').textContent())?.trim();

    expect(shown).toMatch(/^aiid_[A-Za-z0-9_-]{40}$/);

    // The `request` fixture has no cookies: only the token identifies the caller.
    const withToken = await graphql(request, shown!, '{ users { userId } }');

    expect(withToken.status()).toBe(200);
    expect((await withToken.json()).data.users.length).toBeGreaterThan(0);

    const withoutToken = await graphql(request, null, '{ users { userId } }');

    expect(withoutToken.status()).toBe(401);

    const bogus = await graphql(request, 'aiid_' + 'q'.repeat(40), '{ users { userId } }');

    expect(bogus.status()).toBe(401);

    // The request with the token is totalled on the account.
    await page.reload();

    await expect(page.locator('[data-cy="api-token-usage"]')).toContainText('Requests received with this token: 1.');
  });

  test('Regenerating the token invalidates the old one at once', async ({ page, request, login }) => {

    await init();

    await login();

    await page.goto('/account');

    const before = (await page.locator('[data-cy="api-token-value"]').textContent())?.trim();

    expect(before).toBe(testUser.api_token);

    page.once('dialog', (dialog) => dialog.accept());

    await page.locator('[data-cy="regenerate-api-token"]').click();

    await expect(page.locator('[data-cy="toast"]')).toContainText('New API token generated.');

    await expect(page.locator('[data-cy="api-token-value"]')).not.toHaveText(before!);

    const after = (await page.locator('[data-cy="api-token-value"]').textContent())?.trim();

    expect(after).toMatch(/^aiid_[A-Za-z0-9_-]{40}$/);

    expect((await graphql(request, before!, '{ users { userId } }')).status()).toBe(401);
    expect((await graphql(request, after!, '{ users { userId } }')).status()).toBe(200);
  });

  test('A token is not shown to other accounts, even admins', async ({ page, login }) => {

    await init();

    await login();

    await page.goto('/admin');

    // The admin page's list carries no token field at all; ask the API directly as the admin.
    const response = await page.request.post('/api/graphql', {
      headers: { 'Content-Type': 'application/json' },
      data: { query: '{ users { userId api_token } }' },
    });

    const { data } = await response.json();

    const others = data.users.filter((u: { userId: string }) => u.userId !== testUser.userId);

    expect(others.length).toBeGreaterThan(0);

    for (const other of others) {
      expect(other.api_token).toBeNull();
    }

    expect(data.users.find((u: { userId: string }) => u.userId === testUser.userId).api_token).toBe(testUser.api_token);
  });
});
