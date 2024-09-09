import { expect } from '@playwright/test';
import { test, query } from '../../utils';
import { gql } from '@apollo/client';
import { init } from '../../memory-mongo';
import config from '../../config';

test.describe('News Digest', () => {
  const url = '/apps/newsdigest';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should load candidate cards', async ({ page }) => {
    await init();

    await page.goto(url);
    await page.locator('[data-cy="candidate-card"]').first().waitFor();
  });

  test('Should open submit form on pressing submit', async ({ page }) => {
    await init();

    await page.goto(url);
    await page.exposeFunction('open', (url: string) => {
      expect(url.slice(0, 12)).toBe('/apps/submit');
    });

    await page.locator('[data-cy="candidate-dropdown"] button').first().click();
    await page.locator('[data-cy="submit-icon"]').first().click();
  });

  test('Should dismiss and restore items', async ({ page, login, skipOnEmptyEnvironment }) => {

    const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);
    await init({ customData: { users: [{ userId, first_name: 'Test', last_name: 'User', roles: ['admin'] }] } }, { drop: true });

    await page.goto(url);

    const dataId = await page.locator('[data-cy="results"] [data-cy="candidate-card"] [data-cy="candidate-dropdown"]').first().evaluate(el => el.closest('[data-id]').getAttribute('data-id'));

    await page.locator(`[data-id="${dataId}"] [data-cy="candidate-dropdown"]`).click();
    await page.locator(`[data-id="${dataId}"] [data-cy="dismiss-icon"]`).click();

    await expect(page.locator(`[data-cy="results"] [data-id="${dataId}"]`)).toHaveCount(0);
    
    await expect(page.locator('[data-cy="toast"]')).toContainText(`Dismissed article:`);

    const response = await query(
      {
        query: gql`
        query NewsArticles($filter: CandidateFilterType!) {
          candidates(filter: $filter) {
            title
            url
            similarity
            matching_keywords
            matching_harm_keywords
            matching_entities
            date_published
            dismissed
          }
        }
      `,
        variables: {
          filter: {
            dismissed: { EQ: true },
          },
        },
      },
    );
    await expect(response.data.candidates).toHaveLength(1);
    await page.locator(`[data-cy="dismissed-summary"]`).click();
    await page.locator(`[data-id="${dataId}"] [data-cy="candidate-dropdown"]`).click();
    await page.locator(`[data-id="${dataId}"] [data-cy="restore-icon"]`).click();

    await expect(page.locator(`[data-cy="dismissed"] [data-id="${dataId}"]`)).toHaveCount(0);
    await expect(page.locator(`[data-cy="results"] [data-id="${dataId}"]`)).toHaveCount(1);
    await expect(page.locator('[data-cy="toast"]').filter({ hasText: 'Restored article:' })).toContainText(`Restored article:`);

    const response2 = await query(
      {
        query: gql`
        query NewsArticles($filter: CandidateFilterType!) {
          candidates(filter: $filter) {
            title
            url
            similarity
            matching_keywords
            matching_harm_keywords
            matching_entities
            date_published
            dismissed
          }
        }
      `,
        variables: {
          filter: {
            dismissed: { EQ: true },
          },
        },
      },
    );
    
    await expect(response2.data.candidates).toHaveLength(0);
  });
});
