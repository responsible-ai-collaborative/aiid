import { expect } from '@playwright/test';
import { conditionalIntercept, waitForRequest, test } from '../utils';
import { format } from 'date-fns';

const now = new Date();

test.describe('The Landing page', () => {
  test('successfully loads', async ({ page }) => {
    await page.goto('/');
  });

  test('Sends a search to the Discover app', async ({ page }) => {
    await page.goto('/');
    await page.locator('form#quickSearch input').fill('Test');

    await Promise.all([
      page.waitForURL(/\/apps\/discover/), // Wait for the URL to match the pattern
      page.locator('form#quickSearch button[type="submit"]').click() // Trigger the form submission
    ]);

    await expect(page).toHaveURL(/\/apps\/discover/);
    await expect(page).toHaveURL(/s=Test/);
  });


  test('Loads the sponsor modals', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-cy="Waking Up Foundation-image"]').scrollIntoViewIfNeeded();
    await page.locator('[data-cy="Waking Up Foundation-image"]').click();
    await expect(page.locator('[data-cy="sponsor-modal"]')).toBeVisible();
  });

  test('Should submit a report through the Quick Add form', async ({ page }) => {
    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'InsertQuickAdd',
      { data: { insertOneQuickadd: { __typename: 'Quickadd', _id: '6271a62068d0c59a372b0c09' } } },
      'InsertQuickAdd'
    );

    await page.goto('/');
    await page.locator('[data-cy="quick-add"] [name="url"]').fill('https://example.com');
    await page.locator('[data-cy="quick-add"] [type="submit"]').click();

    const insertQuickAddRequest = await waitForRequest('InsertQuickAdd');
    const variables = insertQuickAddRequest.postDataJSON().variables;
    expect(variables.data.url).toBe('https://example.com/');
    expect(variables.data.date_submitted).toBe(format(now, 'yyyy-MM-dd'));

    await expect(page.locator('.tw-toast')).toContainText('Report successfully added to review queue. You can see your submission here.');
  });


  test.skip('Should redirect to the account page when logged in',
    async ({ page, skipOnEmptyEnvironment, login }) => {
      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

      await expect(page).toHaveURL('/');
      await page.locator('[data-cy="sidebar-desktop"]').locator('[data-cy="sidebar-user"]').click();
      await expect(page).toHaveURL(/\/account\//);
    }
  );

  test.skip('Should redirect to the signup page when logged out', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Set a larger viewport size
    await page.goto('/');
    await page.locator('[data-cy="sidebar-desktop"]').locator('[data-cy="sidebar-user"]').click();
    await expect(page).toHaveURL(/\/signup\//);
  });


  test('Should display empty message on common entities card on empty environment',
    async ({ page, runOnlyOnEmptyEnvironment }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Set a larger viewport size
      await page.goto('/');
      await page.locator('[data-cy="common-entities"]').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-cy="common-entities"] h2')).toHaveText('Common Entities');
      await expect(page.locator('[data-cy="common-entities"] a')).toHaveAttribute('href', '/entities/');
      await expect(page.locator('[data-cy="common-entities"]')).toContainText('There are no entities yet');
    }
  );

  test('Renders rich results config', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  });

  test('Should not display the Latest Reports section on empty environment',
    async ({ page, runOnlyOnEmptyEnvironment }) => {
      await page.goto('/');
      await expect(page.locator('.latest-reports-carousel')).not.toBeVisible();
    }
  );

  test('Should not display the Random Incidents section on empty environment',
    async ({ page, runOnlyOnEmptyEnvironment }) => {
      await page.goto('/');
      await expect(page.locator('[data-cy="random-reports"]')).not.toBeVisible();
    }
  );

  test('Loads the random incidents carousel', async ({ page, skipOnEmptyEnvironment }) => {
      await page.goto('/');
      await page.locator('[data-cy="random-incidents-carousel"]').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-cy="random-incidents-carousel"]')).toBeVisible();
      await expect(page.locator('[data-cy="random-incidents-carousel-item"]')).toHaveCount(5);
    });

  test('Renders commit sha in the footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-cy="commit-sha"]')).toBeVisible();
  });

  test.skip('Should load sidebar', async ({ page }) => {
    await page.goto('/');
    const sidebarTree = page.locator('[data-cy="sidebar-desktop"]');
    const lis = await sidebarTree.locator('ul[data-cy="sidebar-tree"] > li').count();
    await expect(lis).toBeGreaterThan(0);
  });


});
