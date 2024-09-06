import { format } from 'date-fns';
import newsArticles from '../../fixtures/candidates/newsArticles.json';
import { expect } from '@playwright/test';
import { test, conditionalIntercept, waitForRequest, query } from '../../utils';
import { gql } from '@apollo/client';
import { init } from '../../memory-mongo';

test.describe('News Digest', () => {
  const url = '/apps/newsdigest';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should load candidate cards', async ({ page }) => {
    await init();
    await page.goto(url);
    const a = Array(14)
      .fill()
      .map((e, i) =>
        new Date(
          new Date().getTime() - 86400000 * i // i days ago
        )
          .toISOString()
          .slice(0, 10)
      );

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
            match: { EQ: true },
            date_published: {
              IN: Array(14)
                .fill()
                .map((e, i) =>
                  new Date(
                    new Date().getTime() - 86400000 * i // i days ago
                  )
                    .toISOString()
                    .slice(0, 10)
                ),
            }
          },
        },
      },
    );

    response.data.candidates[0].date_published = format(new Date(), 'yyyy-MM-dd');x

    await page.goto(url);
    await page.locator('[data-cy="candidate-card"]').first().waitFor();
  });

  test('Should open submit form on pressing submit', async ({ page }) => {
    newsArticles.data.candidates[0].date_published = format(new Date(), 'yyyy-MM-dd');
    newsArticles.data.candidates[1].date_published = format(new Date(), 'yyyy-MM-dd');

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'NewsArticles',
      newsArticles,
      'NewsArticles'
    );

    await page.goto(url);
    await page.exposeFunction('open', (url: string) => {
      expect(url.slice(0, 12)).toBe('/apps/submit');
    });

    await page.locator('[data-cy="candidate-dropdown"] button').first().click();
    await page.locator('[data-cy="submit-icon"]').first().click();
  });

  test('Should dismiss and restore items', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    newsArticles.data.candidates[0].date_published = format(new Date(), 'yyyy-MM-dd');
    newsArticles.data.candidates[1].date_published = format(new Date(), 'yyyy-MM-dd');

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'NewsArticles',
      newsArticles,
      'NewsArticles'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpdateCandidate',
      {
        data: {
          updateOneCandidate: {
            url: 'https://dummy.com',
          },
        },
      },
      'UpdateCandidate'
    );

    await page.goto(url);

    const dataId = await page.locator('[data-cy="results"] [data-cy="candidate-card"] [data-cy="candidate-dropdown"]').first().evaluate(el => el.closest('[data-id]').getAttribute('data-id'));

    await page.locator(`[data-id="${dataId}"] [data-cy="candidate-dropdown"]`).click();
    await page.locator(`[data-id="${dataId}"] [data-cy="dismiss-icon"]`).click();

    await page.locator(`[data-cy="dismissed"] [data-id="${dataId}"]`).waitFor();
    await expect(page.locator(`[data-cy="results"] [data-id="${dataId}"]`)).toHaveCount(0);

    await page.locator(`[data-cy="dismissed-summary"]`).click();
    await page.locator(`[data-id="${dataId}"] [data-cy="candidate-dropdown"]`).click();
    await page.locator(`[data-id="${dataId}"] [data-cy="restore-icon"]`).click();

    await page.locator(`[data-cy="results"] [data-id="${dataId}"]`).waitFor();
    await expect(page.locator(`[data-cy="dismissed"] [data-id="${dataId}"]`)).toHaveCount(0);
  });
});
