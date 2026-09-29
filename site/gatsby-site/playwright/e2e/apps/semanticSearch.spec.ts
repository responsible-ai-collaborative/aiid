import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const url = '/apps/semantic-search/';

const response = (status: string, results: unknown[] = []) => ({
  data: { semanticSearch: { status, results } },
});

const results = Array.from({ length: 30 }, (_, index) => ({
  score: (30 - index) / 100,
  incident: {
    incident_id: index + 1,
    title: `Incident ${index + 1}`,
    date: '2026-01-01',
    description: index === 0 ? 'Description, "quoted"\nline' : `Description ${index + 1}`,
  },
}));

test.describe('Semantic Search', () => {
  test('runs each example immediately and supports results, sorting, pagination, and export errors', async ({
    page,
  }) => {
    const queries: string[] = [];
    let releaseFirstRequest: (() => void) | undefined;

    await page.route('**/graphql', async (route) => {
      const request = route.request().postDataJSON();

      if (request.operationName !== 'SemanticSearch') {
        await route.continue();
        return;
      }

      queries.push(request.variables.query);

      if (queries.length === 1) {
        await new Promise<void>((resolve) => {
          releaseFirstRequest = resolve;
        });
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response('OK', queries.length === 1 ? results : [])),
      });
    });

    await page.goto(url);

    const examples = page.locator('[data-cy="semantic-search-examples"] button');

    await expect(examples).toHaveCount(3);
    await page.locator('[data-cy="semantic-search-example-1"]').click();
    await expect.poll(() => Boolean(releaseFirstRequest)).toBe(true);
    await expect(page.locator('[data-cy="semantic-search-input"]')).toHaveValue(
      'deepfake related incidents'
    );
    await expect(examples.first()).toBeDisabled();
    await expect(page.getByRole('status')).toBeVisible();

    releaseFirstRequest?.();
    await expect(page.locator('[data-cy="semantic-search-count"]')).toHaveText(
      '30 matching incidents'
    );
    await expect(page.locator('[data-cy="row"]')).toHaveCount(25);
    await expect(page.locator('[data-cy="row"]').first()).toContainText('Incident 1');
    await expect(page.locator('[data-cy="total-pages"]')).toHaveText('2');

    await page.locator('[data-cy="last-page"]').click();
    await expect(page.locator('[data-cy="row"]')).toHaveCount(5);
    await expect(page.locator('[data-cy="row"]').first()).toContainText('Incident 26');

    await page.locator('[data-cy="first-page"]').click();
    await page.locator('[data-cy="header-score"] button').click();
    await expect(page.locator('[data-cy="row"]').first()).toContainText('Incident 30');

    const csvDownloadPromise = page.waitForEvent('download');
    await page.locator('[data-cy="semantic-search-export-csv"]').click();
    const csvDownload = await csvDownloadPromise;
    const csvPath = await csvDownload.path();
    const csv = await readFile(csvPath!, 'utf8');

    expect(csvDownload.suggestedFilename()).toMatch(
      /^semantic-search-deepfake-related-incidents-\d{4}-\d{2}-\d{2}\.csv$/
    );
    expect(csv).toContain('\uFEFF"Score","Incident ID","Date","Title","Description","URL"');
    expect(csv).toContain('"0.3","1","2026-01-01","Incident 1","Description, ""quoted""\nline"');
    expect(csv).toContain('"30","2026-01-01","Incident 30"');
    expect(csv.match(/\/cite\//g)).toHaveLength(30);

    await page.evaluate(() => {
      URL.createObjectURL = () => {
        throw new Error('download failed');
      };
    });
    await page.locator('[data-cy="semantic-search-export-csv"]').click();
    await expect(page.locator('[data-cy="semantic-search-export-error"]')).toBeVisible();
    await page.locator('[data-cy="semantic-search-export"]').click();
    await expect(page.locator('[data-cy="semantic-search-export-error"]')).toBeVisible();

    await page.locator('[data-cy="semantic-search-example-2"]').click();
    await expect(page.locator('[data-cy="semantic-search-empty"]')).toBeVisible();
    await page.locator('[data-cy="semantic-search-example-3"]').click();
    await expect(page.locator('[data-cy="semantic-search-empty"]')).toBeVisible();

    expect(queries).toEqual([
      'deepfake related incidents',
      'facial recognition leading to a wrongful arrest',
      'autonomous vehicle crashes involving pedestrians',
    ]);
  });

  test('shows empty, quota, and unavailable states for submitted searches', async ({ page }) => {
    await page.route('**/graphql', async (route) => {
      const request = route.request().postDataJSON();

      if (request.operationName !== 'SemanticSearch') {
        await route.continue();
        return;
      }

      const statuses: Record<string, string> = {
        empty: 'OK',
        quota: 'QUOTA_EXHAUSTED',
        unavailable: 'UNAVAILABLE',
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response(statuses[request.variables.query])),
      });
    });

    await page.goto(url);

    const input = page.locator('[data-cy="semantic-search-input"]');
    const submit = page.locator('[data-cy="semantic-search-submit"]');

    await input.fill('empty');
    await submit.click();
    await expect(page.locator('[data-cy="semantic-search-empty"]')).toBeVisible();

    await input.fill('quota');
    await submit.click();
    await expect(page.locator('[data-cy="semantic-search-limited"]')).toBeVisible();

    await input.fill('unavailable');
    await submit.click();
    await expect(page.locator('[data-cy="semantic-search-unavailable"]')).toBeVisible();
  });
});
