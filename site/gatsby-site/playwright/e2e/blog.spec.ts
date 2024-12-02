import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('Blog', () => {

  test('Should load mdx blog post', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/blog/the-first-taxonomy-of-ai-incidents');

    await expect(page.locator('h1')).toHaveText('The First Taxonomy of AI Incidents');

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('In November the Partnership on AI AI Incident Database (AIID) publicly invited users to instantly search through thousands of pages of text to better understand the limitations of AI products within the real world. Since November, tens of thousands of people from 157 countries have connected to the AIID. Today marks the launch of the next stage of AI Incident Database with its first complete AI incident taxonomy.');

  });

  test('Should load mdx blog post in spanish', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/blog/the-first-taxonomy-of-ai-incidents');

    await expect(page.locator('h1')).toHaveText('La primera taxonomía de incidentes de IA');

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('En noviembre, Partnership on AI AI Incident Database (AIID) invitó públicamente a los usuarios a buscar al instante en miles de páginas de texto para comprender mejor las limitaciones de Productos de IA en el mundo real. Desde noviembre, decenas de miles de personas de 157 países se han conectado al AIID. El día de hoy marca el lanzamiento de la próxima etapa de la base de datos de incidentes de IA con su primera taxonomía de incidentes de IA completa.');

  });

  test('Should load prismic blog post', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/blog/incident-report-2024-january');

    await expect(page.locator('h1')).toHaveText('AI Incident Roundup – January ‘24');

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('Read our month-in-review newsletter recapping new incidents in the AI Incident Database and looking at the trends.');

  });

  test('Should load prismic blog post in spanish', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/blog/incident-report-2024-january');

    await expect(page.locator('h1')).toHaveText('Resumen de incidentes de IA: 24 de enero');

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('Lea nuestro boletín informativo mensual que resume los nuevos incidentes en la base de datos de incidentes de IA y analiza las tendencias.');

  });

  test('Should include outline in blog post', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/blog/the-first-taxonomy-of-ai-incidents');

    const outlineItems = page.locator('[data-cy="outline"] > li');
    await expect(outlineItems).toHaveCount(5);

    await expect(page.locator('[data-cy="outline"]:has-text("Multiple Perspectives")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Collection Biases")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("What Can You Do With This?")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Credit and Acknowledgements")')).toBeVisible();

    await page.setViewportSize({ width: 800, height: 1000 });

    await expect(page.locator('[data-cy="outline"]:has-text("Multiple Perspectives")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Collection Biases")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("What Can You Do With This?")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Credit and Acknowledgements")')).not.toBeVisible();
  });

  test('Should include outline in Spanish blog post', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/blog/multilingual-incident-reporting');

    const outlineItemsCount = await page.locator('[data-cy="outline"] > li').count();
    await expect(outlineItemsCount).toBeGreaterThanOrEqual(3);

    await expect(page.locator('[data-cy="outline"]:has-text("¿Como funciona?")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Llamado a la acción")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Anexo: Riesgos y mejores prácticas")')).toBeVisible();

    await page.setViewportSize({ width: 800, height: 1000 });

    await expect(page.locator('[data-cy="outline"]:has-text("¿Como funciona?")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Llamado a la acción")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Anexo: Riesgos y mejores prácticas")')).not.toBeVisible();
  });

  test('Should have OpenGraph meta tags', async ({ page, skipOnEmptyEnvironment }) => {
    const postSlug = 'incident-report-2022-july-august';
    const title = 'AI Incident Report for July and August 2022';
    const description = 'This compilation of AI incidents published in July and August of 2022 highlights emerging incidents and provides a digest of recent additions to the database.';
    const imageUrl = 'https://incidentdatabase.ai/static/99f8b794fdc0da79022b7f6e38025aca/011c1/aiid-july-august.png';

    await page.goto(`/blog/${postSlug}`);

    await expect(page).toHaveTitle(title);

    await expect(page.locator('head meta[name="twitter:site"]')).toHaveAttribute('content', '@IncidentsDB');
    await expect(page.locator('head meta[name="twitter:creator"]')).toHaveAttribute('content', '@IncidentsDB');

    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute('content', `https://incidentdatabase.ai/blog/${postSlug}/`);
    await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('head meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute('content', imageUrl);
    await expect(page.locator('head meta[property="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('head meta[property="twitter:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('head meta[property="twitter:image"]')).toHaveAttribute('content', imageUrl);
  });
});