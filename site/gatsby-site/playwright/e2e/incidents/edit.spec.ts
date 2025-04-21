import { expect } from '@playwright/test';
import { test, fillAutoComplete, query } from '../../utils';
import { init } from '../../memory-mongo';
import gql from 'graphql-tag';
import incidentsTranslations from '../../seeds/translations/incidents';
import config from '../../config';

test.describe('Incidents', () => {
  const url = '/incidents/edit?incident_id=3';

  test('Should successfully edit incident fields', async ({ page, login }) => {

    await init({
      customData: {
        users: [
          { userId: 'pablo', first_name: 'Pablo', last_name: 'Costa', roles: ['admin'] },
        ]
      }
    });

    await login();

    await page.goto(url);

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
      editor_notes: 'Test editor notes',
    };

    for (const key in values) {
      await page.locator(`[name=${key}]`).fill(values[key]);
    }

    await page.locator('[data-cy="alleged-deployer-of-ai-system-input"] input').first().fill('Test Deployer');
    await page.keyboard.press('Enter');

    await expect(await page.locator('[title="John Doe"]')).toBeVisible();

    await fillAutoComplete(page, '#input-editors', 'Pab', 'Pablo Costa');

    await page.getByText('Save', { exact: true }).click();

    await page.locator('.tw-toast:has-text("Incident 3 updated successfully.")').isVisible();
  });

  test('Should successfully edit tags for linked reports', async ({ page, login }) => {

    await init();

    await login();

    await page.goto(url);

    await expect(page.locator('text=Linked Reports')).toBeVisible();


    const reportSection = page.locator('[data-testid="linked-report-3"]');


    await expect(reportSection.getByText('Test Tag')).toBeVisible();

    await reportSection.getByRole('button', { name: 'Edit' }).click();

    await expect(reportSection.locator('.Typeahead')).toBeVisible();

    const removeButton = reportSection.locator('.rbt-token-remove-button');
    await removeButton.click();

    await reportSection.locator('input[type="text"]').fill('New Tag');
    await reportSection.locator('a[aria-label="New Tag"]').click();

    await reportSection.getByText('Save').click();

    await expect(page.locator('.tw-toast:has-text("Tags updated successfully")')).toBeVisible();

    await expect(reportSection.getByText('New Tag')).toBeVisible();
    await expect(reportSection.getByText('Test Tag')).not.toBeVisible();

    const { data } = await query({
      query: gql`{
        report(filter: { report_number: { EQ: 3 } }) {
          report_number
          tags
        }
      }`
    });

    expect(data.report.tags).toEqual(['New Tag']);
  });

  test('Should handle cancellation when editing tags', async ({ page, login }) => {

    await init();

    await login();

    await page.goto(url);

    await expect(page.locator('text=Linked Reports')).toBeVisible();

    const reportSection = page.locator('[data-testid="linked-report-3"]');

    await expect(reportSection.getByText('Test Tag')).toBeVisible();

    await reportSection.locator('button:has-text("Edit")').click();

    await expect(reportSection.locator('.Typeahead')).toBeVisible();

    const removeButton = reportSection.locator('.rbt-token-remove-button');
    await removeButton.click();

    await reportSection.locator('input[type="text"]').fill('New Tag');
    await reportSection.locator('a[aria-label="New Tag"]').click();

    await reportSection.locator('button:has-text("Cancel")').click();

    await expect(reportSection.getByText('Test Tag')).toBeVisible();
    await expect(reportSection.getByText('New Tag')).not.toBeVisible();

    // Verify the tags in the database using GraphQL query
    const { data } = await query({
      query: gql`{
        report(filter: { report_number: { EQ: 3 } }) {
          report_number
          tags
        }
      }`
    });

    // Verify that the tags in the database remain unchanged after cancellation
    expect(data.report.tags).toEqual(['Test Tag']);
  });

  test('Should successfully edit incident translations', async ({ page, login }) => {

    await init();

    await login();

    await page.goto('/incidents/edit?incident_id=1');

    // iterate over all the translations
    for (const language of config.AVAILABLE_LANGUAGES.split(',').filter((l) => l !== 'en')) {
      const incidentTranslation = incidentsTranslations.find((r) => r.incident_id === 1 && r.language === language);

      await expect(page.locator(`[data-testid="translation-${language}-title"]`)).toHaveValue(incidentTranslation ? incidentTranslation.title : '');
      await expect(page.locator(`[data-testid="translation-${language}-description"]`)).toHaveValue(incidentTranslation ? incidentTranslation.description : '');
    }

    await page.locator(`[data-testid="translation-es-title"]`).fill('Nuevo Título en español');
    await page.locator(`[data-testid="translation-es-description"]`).fill('Nuevo Descripción en español');

    await page.getByText('Save', { exact: true }).click();

    await expect(page.locator('.tw-toast:has-text("Incident 1 updated successfully.")')).toBeVisible();

    const { data } = await query({
      query: gql`{
        incident(filter: { incident_id: { EQ: 1 } }) {
          incident_id
          translations(languages: ["es", "fr", "ja"]) {
            title
            description
            language
          }
        }
      }`,
    });

    expect(data.incident).toMatchObject({
      incident_id: 1,
      translations: [
        {
          language: 'es',
          title: 'Nuevo Título en español',
          description: 'Nuevo Descripción en español',
        },
        {
          language: "fr",
          title: "Titre de l'incident 1",
          description: "Description de l'incident 1",
        },
        {
          language: 'ja',
          title: null,
          description: null,
        },
      ],
    });
  });
});
