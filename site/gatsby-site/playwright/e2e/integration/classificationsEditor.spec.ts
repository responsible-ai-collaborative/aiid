import { test, conditionalIntercept, waitForRequest, setEditorText, query } from '../../utils';
import classificationsMock from '../../fixtures/classifications/editor.json';
import classificationsUpsertMock from '../../fixtures/classifications/editorUpsert.json';
import editorCSETV1Mock from '../../fixtures/classifications/editorCSETV1.json';
import { gql } from '@apollo/client';
import { expect } from '@playwright/test';

test.describe('Classifications Editor', () => {

  const incidentId = 2;
  const reportNumber = 2658;
  const incidentURL = `/cite/${incidentId}`;
  const reportURL = `/reports/${reportNumber}`;

  async function editAndSubmitForm(page) {
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"] >> text=Edit').click();
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"] [data-cy="Notes"] textarea').scrollIntoViewIfNeeded();
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"] [data-cy="Notes"] textarea').fill('Test notes');
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"] [data-cy="Full Description"] input').scrollIntoViewIfNeeded();
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"] [data-cy="Full Description"] input').fill('Test description');
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"] >> text=Submit').click();
    await expect(page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"] >> text=Submit')).toBeDisabled();
  }

  async function setField(page, { short_name, display_type, permitted_values }) {
    let value = permitted_values?.length > 0 ? permitted_values[0] : 'Test';
    await page.locator(`[data-cy="${short_name}"]`).first().scrollIntoViewIfNeeded();

    const fieldLocator = page.locator(`[data-cy="${short_name}"]`).first();
    await fieldLocator.scrollIntoViewIfNeeded();

    switch (display_type) {
      case 'enum':
        permitted_values.length <= 5
          ? await fieldLocator.locator(`[value="${value}"]`).check()
          : await fieldLocator.locator('select').selectOption(value);
        break;
      case 'bool':
        await fieldLocator.locator(`[id="${short_name}-yes"]`).click();
        value = true;
        break;
      case 'string':
        await fieldLocator.locator('input').fill(value);
        break;
      case 'date':
        await fieldLocator.locator('input').fill('2023-01-01');
        value = '2023-01-01';
        break;
      case 'location':
        await fieldLocator.locator('input').fill(`${value}`);
        await page.keyboard.press('Enter');
        break;
      case 'list':
        await fieldLocator.locator('input[type="text"]').fill(`${value}`);
        await page.keyboard.press('Enter');
        value = [value];
        break;
      case 'multi':
        await fieldLocator.locator(`input[value="${value}"]`).click();
        value = [value];
        break;
      case 'long_string':
        await fieldLocator.locator('textarea').fill(value);
        break;
      case 'int':
        await fieldLocator.locator('input').fill('1');
        value = 1;
        break;
      case 'object-list':
        break;
      default:
        throw new Error(`Unknown display type: ${display_type} for ${short_name}`);
    }

    return value;
  }

  test('Shouldn\'t show the classifications editor for unauthenticated users', async ({ page, skipOnEmptyEnvironment }) => {
    await page.goto(incidentURL);
    await expect(page.locator('[data-cy="classifications-editor"]')).not.toBeVisible();
  });

  test('Should show classifications editor on incident page and save edited values', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindClassifications',
      classificationsMock,
      'FindClassifications'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpsertClassification',
      classificationsUpsertMock,
      'UpsertClassification'
    );

    await page.goto(incidentURL);
    await waitForRequest('FindClassifications');
    await expect(page.locator('[data-cy="classifications-editor"]')).toBeVisible();
    await expect(page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"]')).toBeVisible();

    await editAndSubmitForm(page);

    const upsertClassificationRequest = await waitForRequest('UpsertClassification');
    const variables = upsertClassificationRequest.postDataJSON().variables;
    expect(variables.query.reports).toBeUndefined();
    expect(variables.query.incidents).toEqual({ incident_id: incidentId });
    expect(variables.query.namespace).toBe('CSETv0');
    expect(variables.data.incidents).toEqual({ link: [incidentId] });
    expect(variables.data.reports).toEqual({ link: [reportNumber, 2659] });
    expect(variables.data.notes).toBe('Test notes');
    expect(variables.data.attributes.find((a) => a.short_name == 'Full Description').value_json).toBe('"Test description"');
  });

  test('Should show classifications editor on report page and save edited values', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindClassifications',
      classificationsMock,
      'FindClassifications'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpsertClassification',
      classificationsUpsertMock,
      'UpsertClassification'
    );

    await page.goto(reportURL);
    await waitForRequest('FindClassifications');
    await expect(page.locator('[data-cy="classifications-editor"]')).toBeVisible();
    await expect(page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv0"]')).toBeVisible();

    await editAndSubmitForm(page);

    const upsertClassificationRequest = await waitForRequest('UpsertClassification');
    const variables = upsertClassificationRequest.postDataJSON().variables;
    expect(variables.query.incidents).toBeUndefined();
    expect(variables.query.reports).toEqual({ report_number: reportNumber });
    expect(variables.query.namespace).toBe('CSETv0');
    expect(variables.data.incidents).toEqual({ link: [] });
    expect(variables.data.reports).toEqual({ link: [reportNumber, 2659] });
    expect(variables.data.notes).toBe('Test notes');
    expect(variables.data.attributes.find((a) => a.short_name == 'Full Description').value_json).toBe('"Test description"');
  });

  test('Should show classifications editor on report page and add a new classification', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindClassifications',
      { data: { classifications: [] } },
      'FindClassifications'
    );

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'UpsertClassification',
      classificationsUpsertMock,
      'UpsertClassification'
    );

    await page.goto(reportURL);
    await waitForRequest('FindClassifications');
    await expect(page.locator('[data-cy="classifications-editor"]')).toBeVisible();
    await page.locator('text=Select a taxonomy').click();
    await page.locator('text=GMF').click();
    await page.locator('text=Add').first().click();
    await expect(page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"]')).toBeVisible();

    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"] [data-cy="Notes"] textarea').scrollIntoViewIfNeeded();
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"] [data-cy="Notes"] textarea').fill('Test notes');
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"] >> text=Submit').click();

    const upsertClassificationRequest = await waitForRequest('UpsertClassification');
    const variables = upsertClassificationRequest.postDataJSON().variables;
    expect(variables.query.incidents).toBeUndefined();
    expect(variables.query.reports).toEqual({ report_number: reportNumber });
    expect(variables.query.namespace).toBe('GMF');
    expect(variables.data.incidents).toEqual({ link: [] });
    expect(variables.data.reports).toEqual({ link: [reportNumber] });
    expect(variables.data.notes).toBe('Test notes');
  });

  const namespaces = ['CSETv0', 'GMF', 'CSETv1'];
  for (const namespace of namespaces) {
    test(`Should properly display and store ${namespace} classification values`, async ({ page, login, skipOnEmptyEnvironment }) => {
      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

      await conditionalIntercept(
        page,
        '**/graphql',
        (req) => req.postDataJSON().operationName == 'FindClassifications',
        { data: { classifications: [] } },
        'FindClassifications'
      );

      await page.goto(incidentURL);
      await waitForRequest('FindClassifications');

      const { data: { taxas } } = await query({
        query: gql`
          query TaxasQuery($namespace: String) {
            taxas(query: { namespace: $namespace }) {
              namespace
              field_list {
                permitted_values
                display_type
                short_name
                mongo_type
              }
            }
          }
        `,
        variables: { namespace }
      });

      for (const taxa of taxas) {
        await page.locator('text=Select a taxonomy').scrollIntoViewIfNeeded();
        await page.locator('text=Select a taxonomy').click();
        await page.locator(`[data-testid="flowbite-tooltip"] >> text=${namespace}`).first().click();
        await page.locator('text=Add').first().click();
        await conditionalIntercept(
          page,
          '**/graphql',
          (req) => req.postDataJSON().operationName == 'UpsertClassification' && req.postDataJSON()?.variables?.query.namespace == namespace,
          classificationsUpsertMock,
          `Upsert-${namespace}`,
        );

        // await page.locator(`[data-cy="classifications-editor"] [data-cy="taxonomy-${namespace}"] text=Edit`).click();
        const selectedValues = {};

        for (const field of taxa.field_list) {
          const value = await setField(page, {
            short_name: field.short_name,
            display_type: field.display_type,
            permitted_values: field.permitted_values
          });
          selectedValues[field.short_name] = value;
        }

        await page.locator(`[data-cy="classifications-editor"] [data-cy="taxonomy-${namespace}"] >> text=Submit`).click();

        const upsertRequest = await waitForRequest(`Upsert-${namespace}`);
        const variables = upsertRequest.postDataJSON().variables;
        expect(variables.query.namespace).toBe(namespace);

        for (const field of taxa.field_list) {
          const skippedFields = [
            'Known AI Technology Snippets',
            'Known AI Technical Failure Snippets',
            'Entities',
            'Known AI Goal Snippets',
            'Potential AI Goal Snippets',
            'Potential AI Technology Snippets',
            'Potential AI Technical Failure Snippets'
          ];

          if (!skippedFields.includes(field.short_name)) {
            expect(variables.data.attributes.find((a) => a.short_name == field.short_name)).toEqual({
              short_name: field.short_name,
              value_json: JSON.stringify(selectedValues[field.short_name])
            });
          }
        }

      }
    });
  }

  test('Should synchronize duplicate fields', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'FindClassifications',
      editorCSETV1Mock,
      'FindClassifications'
    );

    await page.goto(incidentURL);
    await waitForRequest('FindClassifications');

    await page.locator('[data-cy="taxonomy-CSETv1"]').first().scrollIntoViewIfNeeded();
    await page.locator('[data-cy="taxonomy-CSETv1"] >> text=Edit').click();
    await page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"]').first().scrollIntoViewIfNeeded();
    await page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] >> text=yes').first().click();
    await page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').first().check();
    await expect(page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').last()).toBeChecked();
    await page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').last().click();
    await expect(page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').first()).not.toBeChecked();
  });
});
