import { test } from '../utils';
import incident10 from '../fixtures/incidents/incident10.json';
import { conditionalIntercept, waitForRequest } from '../utils';
import config from '../config';
import { expect } from '@playwright/test';

test.describe('Dynamic Cite pages', () => {
  const incidentId = 10;
  const url = `/cite/${incidentId}`;

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test("Shouldn't display live data option if it's not logged in", async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('[data-cy="toogle-live-data"]')).not.toBeVisible();
  });

  test('Should load dynamic Incident data', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);
    await page.goto(url);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncident',
      incident10,
      'findIncident'
    );

    await page.locator('[data-cy="toogle-live-data"]').click();
    await waitForRequest('findIncident');

    await expect(page.getByTestId('incident-title')).toContainText(
      'Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees V2', { timeout: 30000 }
    );
    await expect(page.locator('text=Kronos’s scheduling algorithm and its use by Starbucks managers allegedly negatively impacted financial and scheduling stability for Starbucks employees, which disadvantaged wage workers. V2')).toBeVisible();
    await expect(page.locator('[data-cy="alleged-entities"]')).toHaveText(
      'Alleged: Google and Kronos developed an AI system deployed by Starbucks and Google, which harmed Google and Starbucks employees.'
    );

    await expect(page.locator('[data-cy="citation"]').getByText("Report Count", { exact: true }).locator('xpath=following-sibling::div[1]')).toHaveText('11');
    await expect(page.locator('[data-cy="citation"]').getByText("Editors", { exact: true }).locator('xpath=following-sibling::div[1]')).toHaveText('Sean McGregor, Pablo Costa');
    await expect(page.locator('[data-cy="variant-card"]')).toHaveCount(1);
  });

  test('Should display a new Variant if live mode is turned on', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);
    await page.goto(url);

    const new_date_published = '2000-01-01';
    const new_text = 'New text example with more than 80 characters. Lorem ipsum dolor sit amet, consectetur';
    const new_inputs_outputs_1 = 'New Input text';
    const new_inputs_outputs_2 = 'New Output text';
    const new_submitter = 'New Submitter';

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncident',
      incident10,
      'findIncident'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) =>
        req.postDataJSON().operationName == 'CreateVariant' &&
        req.postDataJSON().variables.input.incidentId === incidentId &&
        req.postDataJSON().variables.input.variant.date_published === new_date_published &&
        req.postDataJSON().variables.input.variant.submitters[0] === new_submitter &&
        req.postDataJSON().variables.input.variant.text === new_text &&
        req.postDataJSON().variables.input.variant.inputs_outputs[0] === new_inputs_outputs_1 &&
        req.postDataJSON().variables.input.variant.inputs_outputs[1] === new_inputs_outputs_2,
      {
        data: {
          createVariant: {
            __typename: 'CreateVariantPayload',
            incident_id: incidentId,
            report_number: 2313,
          },
        },
      },
      'createVariant'
    );

    await page.locator('[data-cy="toogle-live-data"]').click();
    await waitForRequest('findIncident');

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
    await waitForRequest('createVariant');
    await waitForRequest('findIncident');
  });

  test('There should not be image errors (400)', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);
    await page.goto(url);
    await page.addInitScript(() => {
      window.console.error = (...args) => {
        if (!args[0].includes('https://res.cloudinary.com') || !args[0].includes('400')) {
          console.error(...args);
        }
      };
    });

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindIncident',
      incident10,
      'findIncident'
    );

    await page.locator('[data-cy="toogle-live-data"]').click();
    await waitForRequest('findIncident');

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
