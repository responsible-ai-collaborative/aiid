import { expect } from '@playwright/test';
import { conditionalIntercept, waitForRequest, test, fillAutoComplete } from '../../utils';
import { init } from '../../memory-mongo';

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
});
