

import { test } from '../utils';
import { expect } from '@playwright/test';
import config from '../config';

test.describe('Entities page', () => {
  const url = '/entities';

  test('Should display Edit button only for Admin users', async ({ page, login, skipOnEmptyEnvironment }) => {
    
    await page.goto(url);

    expect(await page.locator('[data-cy="edit-entity-btn"]').count()).toBe(0);

    await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });
    await page.goto(url);
    const editButton = page.locator('[data-cy="edit-entity-btn"]').first();
    expect(await editButton.getAttribute('href')).toBe('/entities/edit?entity_id=starbucks-employees');
    await editButton.click();
    await page.waitForURL(url => !url.toString().includes('/entities/edit?entity_id=starbucks-employees'));
  });
});