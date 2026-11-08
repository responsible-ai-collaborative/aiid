import { expect } from '@playwright/test';
import { test } from '../utils';

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
    await expect(page.locator('[data-cy="sponsor-modal"] h5', { hasText: 'Waking Up Foundation' })).toBeVisible();
  });

  test('Links the Collaborative, its contributors and its financials', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('a[href="https://raicollab.org/"]')).toHaveText('Responsible AI Collaborative');

    // The founding report is no longer featured. SEE: #4180
    await expect(page.locator('img[src="/images/reportcover.png"]')).toHaveCount(0);

    const contributors = page.locator('[data-cy="raic-contributors"]');

    await expect(contributors.locator('a[href="/summaries/contributorCalendar/"]')).toHaveText('contributors');
    await expect(contributors.locator('a[href="/summaries/mediaLandscape/"]')).toHaveText('dataset');
    await expect(contributors.locator('a[href="/summaries/leaderboard/"]')).toHaveText('leaderboard');
    await expect(contributors.locator('a[href="https://github.com/responsible-ai-collaborative/aiid/graphs/contributors"]')).toHaveText('contributing to the codebase on GitHub');

    const financials = page.locator('[data-cy="raic-financials"]');

    await expect(financials.locator('a[href="https://projects.propublica.org/nonprofits/organizations/881046583"]')).toHaveText('Form 990');
    await expect(financials.locator('a[href="https://donate.stripe.com/28E7sDbq18xN82kbJ8bQY00"]')).toHaveText('donation.');
    await expect(financials).toContainText('none of our budget on fundraising');
  });

  test('Translates the Collaborative paragraphs with their links in place', async ({ page }) => {
    await page.goto('/es/');

    const financials = page.locator('[data-cy="raic-financials"]');

    await expect(financials.locator('a[href="https://donate.stripe.com/28E7sDbq18xN82kbJ8bQY00"]')).toHaveText('una donación.');
    await expect(page.locator('[data-cy="raic-contributors"] a[href="/es/summaries/leaderboard/"]')).toHaveText('tabla de clasificación');
  });

  test.skip('Should redirect to the account page when logged in',
    async ({ page, skipOnEmptyEnvironment, login }) => {
      await login();

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

  // Random Incidents block is temporarily hidden on the landing page
  test.skip('Loads the random incidents carousel', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/');
    await page.locator('[data-cy="random-incidents-carousel"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-cy="random-incidents-carousel"]')).toBeVisible();
    await expect(page.locator('[data-cy="random-incidents-carousel-item"]')).toHaveCount(4);
  });

  test('Renders commit sha in the footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-cy="commit-sha"]')).toBeVisible();
  });

  test('Should load sidebar', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/');
    const sidebarTree = page.locator('[data-testid="sidebar-desktop"]');
    const lis = await sidebarTree.locator('ul[data-testid="sidebar-tree"] > li').count();
    await expect(lis).toBeGreaterThan(0);
  });

  test('Should collapse sidebar', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/');
    const sidebarTree = page.locator('[data-testid="sidebar-desktop"]');
    await sidebarTree.locator('[data-cy="collapse-button"]').click();
    const sidebar = await page.locator('[id="sidebar"]').first();
    let hasClass = await sidebar.evaluate((el, className) => {
      return el.classList.contains(className);
    }, 'collapsed');
    expect(hasClass).toBe(true);
    await sidebarTree.locator('[data-cy="collapse-button"]').click();
    hasClass = await sidebar.evaluate((el, className) => {
      return el.classList.contains(className);
    }, 'collapsed');
    expect(hasClass).toBe(false);
  });

  test('Should display sidebar tooltip when collapsed', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto('/');
    const sidebarTree = page.locator('[data-testid="sidebar-desktop"]');
    await sidebarTree.locator('[data-cy="collapse-button"]').click();
    // Hovers over a sidebar item
    await page.getByTestId('sidebar-desktop').getByTestId("sidebar-welcome").hover();
    await expect(page.getByTestId('sidebar-desktop').locator('[data-testid="flowbite-tooltip"]', { hasText: 'Welcome to the AIID' }))
      .toBeVisible();

  });

  test('Should display the latest incident title translation', async ({ page }) => {
    await page.goto('/es/');
    // Incident 1 has a spanish translation
    await expect(page.locator('[data-testid="latest-incident-title"]').nth(0)).toHaveText('Incidente 1: Título del Incidente 1');
    // Incident 2 does not have a spanish translation
    await expect(page.locator('[data-testid="latest-incident-title"]').nth(1)).toHaveText('Incidente 2: Título del incidente 2 actualizado. Listo para volver a traducir.');
    // Incident 3 does not have a spanish translation
    await expect(page.locator('[data-testid="latest-incident-title"]').nth(2)).toHaveText('Incidente 3: Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees');
  });
});
