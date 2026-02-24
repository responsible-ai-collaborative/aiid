import { test } from '../utils';
import { expect } from '@playwright/test';

test.describe('Docs', () => {

  test('Should load mdx document in English', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/research/4-related-work');

    await expect(page.locator('.titleWrapper h1')).toHaveText('Related Work');

    const div = await page.locator("[data-testid='doc-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('While formal AI incident research is relatively new, a number of people have been collecting what could be considered incidents. These include,');

  });

  test('Should load mdx doc in spanish', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('es');
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/research/4-related-work');

    await expect(page.locator('.titleWrapper h1')).toHaveText('Trabajo Relacionado');

    const div = await page.locator("[data-testid='doc-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('Si bien la investigación formal sobre incidentes de IA es relativamente nueva, varias personas han estado recopilando lo que podría considerarse incidentes. Entre ellos se incluyen:');

  });

  test('Should load mdx doc in french', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('fr');
    
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/fr/research/4-related-work');

    await expect(page.locator('.titleWrapper h1')).toHaveText('Travaux connexes');

    const div = await page.locator("[data-testid='doc-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain("Bien que la recherche formelle sur les incidents liés à l'IA soit relativement récente, plusieurs personnes ont collecté ce qui pourrait être considéré comme des incidents. Parmi ceux-ci, on trouve :");

  });

  test('Should load mdx doc in japanese', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('ja');
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/ja/research/4-related-work');

    await expect(page.locator('.titleWrapper h1')).toHaveText('関連研究');

    const div = await page.locator("[data-testid='doc-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('AIインシデントに関する正式な研究は比較的新しい分野ですが、インシデントと見なし得る事例を収集してきた人々が数多く存在します。以下がその例です。');

  });

  test('Should load prismic doc post', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/about');

    await expect(page.locator('h1')).toHaveText('About');

    const div = await page.locator("[data-testid='markdown-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('Intelligent systems are currently prone to unforeseen and often dangerous failures when they are deployed to the real world.');

  });

  test('Should load prismic doc post in spanish', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('es');
    
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/about');

    await expect(page.locator('h1')).toHaveText('Acerca de');

    const div = await page.locator("[data-testid='markdown-content']");
    const textContent = await div.textContent();
    expect(textContent).toContain('Actualmente, los sistemas inteligentes son propensos a sufrir fallos imprevistos y, a menudo, peligrosos cuando se implementan en el mundo real.');

  });

  test('Should include outline in About page', async ({ page, skipOnEmptyEnvironment }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/about');

    const outlineItems = page.locator('[data-cy="outline"] > li');
    await expect(outlineItems).toHaveCount(7);

    await expect(page.locator('[data-cy="outline"]:has-text("Why \\"AI Incidents\\"?")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("What is an Incident?")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Current and Future Users")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("When Should You Report an Incident?")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Board of Directors")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Collaborators")')).toBeVisible();

    await page.setViewportSize({ width: 800, height: 1000 });


    await expect(page.locator('[data-cy="outline"]:has-text("Why \\"AI Incidents\\"?")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("What is an Incident?")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Current and Future Users")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("When Should You Report an Incident?")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Board of Directors")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Collaborators")')).not.toBeVisible();
  });

  test('Should include outline in Spanish About page', async ({ page, skipOnEmptyEnvironment, skipIfLanguageUnavailable }) => {
    await skipIfLanguageUnavailable('es');
    
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/es/about');

    const outlineItems = page.locator('[data-cy="outline"] > li');
    await expect(outlineItems).toHaveCount(7);

    await expect(page.locator('[data-cy="outline"]:has-text("¿Por qué \\"incidentes de IA\\"?")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("¿Qué es un incidente?")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Usuarios actuales y futuros")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("¿Cuándo debería informar un incidente?")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Junta Directiva")')).toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Colaboradores")')).toBeVisible();

    await page.setViewportSize({ width: 800, height: 1000 });

    await expect(page.locator('[data-cy="outline"]:has-text("¿Por qué \\"incidentes de IA\\"?")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("¿Qué es un incidente?")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Usuarios actuales y futuros")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("¿Cuándo debería informar un incidente?")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Junta Directiva")')).not.toBeVisible();
    await expect(page.locator('[data-cy="outline"]:has-text("Colaboradores")')).not.toBeVisible();
  });
});