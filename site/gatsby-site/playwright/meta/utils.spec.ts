import { expect } from '@playwright/test';
import { test } from '../utils';
import { init } from '../memory-mongo';
import config from '../config';

test.describe('Test playwright utils', () => {

    test('Login fixture should mock user and roles', async ({ page, login }) => {

        const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'Fula', last_name: 'Nito' } });

        await page.goto('/account');

        await expect(page.locator('[data-cy="first-name"]')).toHaveText('Fula');
        await expect(page.locator('[data-cy="last-name"]')).toHaveText('Nito');
    });

});
