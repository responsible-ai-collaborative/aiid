import { test, waitForRequest, query } from '../utils';
import { gql } from '@apollo/client';
import { expect, Page } from '@playwright/test';
import { init } from '../memory-mongo';

test.describe('Classifications Editor', () => {

  const incidentId = 3;
  const reportNumber = 5;
  const incidentURL = `/cite/${incidentId}`;
  const reportURL = `/reports/${reportNumber}`;

  async function editAndSubmitForm(page: Page) {
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv1"] >> text=Edit').click();
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv1"] [data-cy="Notes"] textarea').fill('Test notes');
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv1"] >> text=Submit').click();
    await expect(page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv1"] >> text=Submit')).toBeDisabled();
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
    await init();

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'] } });

    await page.goto(incidentURL);

    await expect(page.locator('[data-cy="classifications-editor"]')).toBeVisible();
    await expect(page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv1"]')).toBeVisible();

    await editAndSubmitForm(page);

    await expect(page.locator('[data-cy="classifications-editor"]').getByText('Submit')).not.toBeVisible();

    const { data: { classifications } } = await query({
      query: gql`
      query FindClassifications($filter: ClassificationFilterType!) {
        classifications(filter: $filter) {
          notes
          attributes {
            short_name
            value_json
          }
        }
      }
    `, variables: { filter: { incidents: { EQ: 3 }, namespace: { EQ: "CSETv1" } } }
    });

    expect(classifications).toHaveLength(1);
    expect(classifications[0]).toMatchObject({
      notes: 'Test notes'
    });
  });

  test('Should show classifications editor on report page and save edited values', async ({ page, login, skipOnEmptyEnvironment }) => {

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });

    await page.goto(reportURL);
    await waitForRequest('FindClassifications');
    await expect(page.locator('[data-cy="classifications-editor"]')).toBeVisible();
    await expect(page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-CSETv1"]')).toBeVisible();

    await editAndSubmitForm(page);

    await expect(page.locator('[data-cy="classifications-editor"]').getByText('Submit')).not.toBeVisible();

    const { data: { classifications } } = await query({
      query: gql`
      query FindClassifications($filter: ClassificationFilterType!) {
        classifications(filter: $filter) {
          notes
          attributes {
            short_name
            value_json
          }
        }
      }
    `, variables: { filter: { reports: { EQ: 5 }, namespace: { EQ: "CSETv1" } } }
    });

    expect(classifications).toHaveLength(1);
    expect(classifications[0]).toMatchObject({
      notes: 'Test notes'
    });
  });

  test('Should show classifications editor on report page and add a new classification', async ({ page, login, skipOnEmptyEnvironment }) => {

    await init();

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });

    await page.goto(reportURL);
    await waitForRequest('FindClassifications');
    await expect(page.locator('[data-cy="classifications-editor"]')).toBeVisible();
    await page.locator('text=Select a taxonomy').click();
    await page.locator('text=GMF').click();
    await page.locator('text=Add').first().click();
    await expect(page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"]')).toBeVisible();

    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"] [data-cy="Notes"] textarea').fill('Test notes');
    await page.locator('[data-cy="classifications-editor"] [data-cy="taxonomy-GMF"] >> text=Submit').click();

    await expect(page.locator('[data-cy="classifications-editor"]').getByText('Submit')).not.toBeVisible();

    const { data: { classifications } } = await query({
      query: gql`
      query FindClassifications($filter: ClassificationFilterType!) {
        classifications(filter: $filter) {
          namespace
          notes
          attributes {
            short_name
            value_json
          }
        }
      }
    `, variables: { filter: { reports: { EQ: 5 }, namespace: { EQ: "GMF" } } }
    });

    expect(classifications).toHaveLength(1);
    expect(classifications[0]).toMatchObject({
      notes: 'Test notes',
      namespace: 'GMF'
    })
  });

  const tests = [
    { incident_id: 2, namespace: 'GMF' },
    { incident_id: 1, namespace: 'CSETv1' }
  ];

  for (const { incident_id, namespace } of tests) {

    test(`Should properly display and store ${namespace} classification values`, async ({ page, login, skipOnEmptyEnvironment }) => {

      await init();

      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });

      await page.goto(`/cite/${incident_id}`);

      const { data: { taxas } } = await query({
        query: gql`
          query TaxasQuery($namespace: String) {
            taxas(filter: { namespace: {EQ: $namespace} }) {
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
        await page.locator('text=Select a taxonomy').click();
        await page.locator(`[data-testid="flowbite-tooltip"] >> text=${namespace}`).first().click();
        await page.locator('text=Add').first().click();

        const selectedValues = {};

        for (const field of taxa.field_list) {
          const value = await setField(page, {
            short_name: field.short_name,
            display_type: field.display_type,
            permitted_values: field.permitted_values
          });
          selectedValues[field.short_name] = value;
        }

        await page.locator(`[data-cy="classifications-editor"]`).getByText(`Submit`).click();

        await expect(page.locator(`[data-cy="classifications-editor"]`).getByText(`Submit`)).not.toBeVisible();

        const { data: { classifications } } = await query({
          query: gql`
            query TaxasQuery($namespace: String) {
              classifications(filter: { namespace: { EQ: $namespace }, incidents: { EQ: 1 } }) {
                namespace
                attributes {
                  short_name
                  value_json
                }
              }
            }
          `,
          variables: { namespace }
        });

        const [classification] = classifications;

        for (const [name, value] of Object.entries(selectedValues)) {

          const attribute = classification.attributes.find(({ short_name }) => short_name === name);
          const definition = taxa.field_list.find(({ short_name }) => short_name === name);

          if (definition.required) {

            expect(attribute.value_json === JSON.stringify(value));
          }
          else if (attribute) {

            expect(attribute.value_json === JSON.stringify(value));
          }
        }
      }
    });
  }

  test('Should synchronize duplicate fields', async ({ page, login, skipOnEmptyEnvironment }) => {
    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { first_name: 'John', last_name: 'Doe', roles: ['admin'] } });

    await page.goto(incidentURL);
    await waitForRequest('FindClassifications');

    await page.locator('[data-cy="taxonomy-CSETv1"] >> text=Edit').click();
    await page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] >> text=yes').first().click();
    await page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').first().check();
    await expect(page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').last()).toBeChecked();
    await page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').last().click();
    await expect(page.locator('[data-cy="taxonomy-CSETv1"] [data-cy="AI System"] [value="yes"]').first()).not.toBeChecked();
  });
});