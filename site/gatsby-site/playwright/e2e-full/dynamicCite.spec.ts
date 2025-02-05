import { test } from '../utils';
import config from '../config';
import { expect } from '@playwright/test';
import { init, seedCollection } from '../memory-mongo';

test.describe('Dynamic Cite pages', () => {
  const incidentId = 3;
  const url = `/cite/${incidentId}`;

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test("Shouldn't display live data option if it's not logged in", async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('[data-cy="toogle-live-data"]')).not.toBeVisible();
  });

  test('Should load dynamic Incident data', async ({ page, login, skipOnEmptyEnvironment }) => {

    const [userId] = await login();
    await init();

    await seedCollection({ name: 'users', docs: [{ userId: userId, roles: ['admin'], first_name: 'John', last_name: 'Doe' }], drop: false });

    await page.goto(url);

    await page.locator('[data-cy="toogle-live-data"]').click();;

    await expect(page.getByTestId('incident-title')).toContainText(
      'Incident 3: Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees'
    );

    await expect(page.getByText(`Kronos’s scheduling algorithm and its use by Starbucks managers allegedly negatively impacted financial and scheduling stability for Starbucks employees, which disadvantaged wage workers.`)).toBeVisible();

    await expect(page.locator('[data-cy="alleged-entities"]')).toHaveText(
      'Alleged: Kronos developed an AI system deployed by Starbucks, which harmed Starbucks Employees.Alleged implicated AI system: Entity 1'
    );

    await expect(page.locator('[data-cy="citation"]').getByText("Report Count", { exact: true }).locator('xpath=following-sibling::div[1]')).toHaveText('2');
    await expect(page.locator('[data-cy="citation"]').getByText("Editors", { exact: true }).locator('xpath=following-sibling::div[1]')).toHaveText('John Doe');
    
    await expect(page.locator('[data-cy="variant-card"]')).toHaveCount(3);
  });

  test('Should display a new Variant if live mode is turned on', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login();
    await page.goto(url);

    const new_date_published = '2000-01-01';
    const new_text = 'New text example with more than 80 characters. Lorem ipsum dolor sit amet, consectetur';
    const new_inputs_outputs_1 = 'New Input text';
    const new_inputs_outputs_2 = 'New Output text';
    const new_submitter = 'New Submitter';

    await page.locator('[data-cy="toogle-live-data"]').click();

    await page.locator('[data-cy=add-variant-btn]').scrollIntoViewIfNeeded();
    await page.locator('[data-cy=add-variant-btn]').click();

    await page.locator('[data-cy=variant-form]').waitFor();

    await page.locator('[data-cy="variant-form-date-published"]').fill(new_date_published);
    await page.locator('input[name="submitters"]').fill(new_submitter);
    await page.locator('[data-cy="variant-form-text"]').fill(new_text);
    await page.locator('[data-cy="variant-form-inputs-outputs"]').first().fill(new_inputs_outputs_1);
    await page.locator('[data-cy="add-text-row-btn"]').click();
    await page.locator('[data-cy="variant-form-inputs-outputs"]').nth(1).fill(new_inputs_outputs_2);

    await page.locator('[data-cy=add-variant-submit-btn]').click();


    //TODO check for variant
  });

  test('There should not be image errors (400)', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login();
    await page.goto(url);
    await page.addInitScript(() => {
      window.console.error = (...args) => {
        if (!args[0].includes('https://res.cloudinary.com') || !args[0].includes('400')) {
          console.error(...args);
        }
      };
    });

    await page.locator('[data-cy="toogle-live-data"]').click();

    const consoleErrors = await page.evaluate(() => {
      const errors: string[] = [];
      const originalConsoleError = console.error;
      console.error = (...args) => {
        errors.push(args.join(' '));
        originalConsoleError(...args);
      };
      return errors;
    });
    const noImagesErrors = consoleErrors.every((error) => !(error.includes('https://res.cloudinary.com') && error.includes('400')));
    expect(noImagesErrors).toBe(true);

  });
});
