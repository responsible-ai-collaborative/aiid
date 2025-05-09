import { test } from '../utils';
import { expect } from '@playwright/test';
import config from '../config';

test.describe('Blog', () => {

  test('Should load mdx blog post', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/blog/the-first-taxonomy-of-ai-incidents');

    await expect(page.locator('.titleWrapper h1')).toHaveText('The First Taxonomy of AI Incidents');

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('In November the Partnership on AI AI Incident Database (AIID) publicly invited users to instantly search through thousands of pages of text to better understand the limitations of AI products within the real world. Since November, tens of thousands of people from 157 countries have connected to the AIID. Today marks the launch of the next stage of AI Incident Database with its first complete AI incident taxonomy.');
    
    // Check if the image is a valid image
    const image = await page.locator("[data-testid='blog-image']");
    await expect(image).toBeVisible();
    const imageUrl = await image.getAttribute('src');
    const imageResponse = await page.goto(imageUrl);
    expect(imageResponse.status()).toBe(200); 

  });

  test('Should load mdx blog post in spanish', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('es');

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/blog/representation-and-imagination');

    await expect(page.locator('.titleWrapper h1')).toHaveText('Representación e imaginación para prevenir los daños de la IA');

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('La base de datos de incidentes de IA se lanzó públicamente en noviembre de 2020 por Partnership on AI como un panel de control de los daños de IA realizados en el mundo real.');

  });

  test('Should load mdx blog post in french', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('fr');

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/fr/blog/join-raic');

    await expect(page.locator('.titleWrapper h1')).toHaveText("Rejoignez l'équipe fondatrice de Responsible AI Collaborative");

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain("La base de données d'incidents d'IA lancée publiquement en novembre 2020 en tant que tableau de bord des dommages causés par l'IA dans le monde réel.");

  });

  test('Should load prismic blog post', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/blog/incident-report-2024-january');

    await expect(page.locator('h1')).toHaveText('AI Incident Roundup – January ‘24');

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('Read our month-in-review newsletter recapping new incidents in the AI Incident Database and looking at the trends.');

    // Check if the image is a valid image
    const image = await page.locator("[data-testid='blog-image']");
    await expect(image).toBeVisible();
    const imageUrl = await image.getAttribute('src');
    const imageResponse = await page.goto(imageUrl);
    expect(imageResponse.status()).toBe(200); 
  });

  test('Should load prismic blog post in spanish', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('es');

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/blog/incident-report-2024-january');

    await expect(page.locator('h1')).toHaveText('Resumen de incidentes de IA: 24 de enero');

    const div = await page.locator("[data-testid='blog-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('Lea nuestro boletín informativo mensual que resume los nuevos incidentes en la base de datos de incidentes de IA y analiza las tendencias.');

    // Check if the image is a valid image
    const image = await page.locator("[data-testid='blog-image']");
    await expect(image).toBeVisible();
    const imageUrl = await image.getAttribute('src');
    const imageResponse = await page.goto(imageUrl);
    expect(imageResponse.status()).toBe(200); 
  });

  test('Should include outline in blog post', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/blog/the-first-taxonomy-of-ai-incidents');

    await expect(page.locator('[data-cy="outline"]')).toBeVisible();
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

  test('Should include outline in Spanish blog post', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('es');

    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/blog/multilingual-incident-reporting');

    await expect(page.locator('[data-cy="outline"]')).toBeVisible();
    const outlineItems = page.locator('[data-cy="outline"] > li');
    await expect(outlineItems).toHaveCount(4);

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
    const imageUrl = `${config.SITE_URL}/static/99f8b794fdc0da79022b7f6e38025aca/011c1/aiid-july-august.png`;

    await page.goto(`/blog/${postSlug}`);

    await expect(page).toHaveTitle(title);

    await expect(page.locator('head meta[name="twitter:site"]')).toHaveAttribute('content', '@IncidentsDB');
    await expect(page.locator('head meta[name="twitter:creator"]')).toHaveAttribute('content', '@IncidentsDB');

    await expect(page.locator('head meta[property="og:url"]')).toHaveAttribute('content', `${config.SITE_URL}/blog/${postSlug}/`);
    await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('head meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute('content', imageUrl);
    await expect(page.locator('head meta[property="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('head meta[property="twitter:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('head meta[property="twitter:image"]')).toHaveAttribute('content', imageUrl);
  });
});