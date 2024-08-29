import { expect } from '@playwright/test';
import { test } from '../utils';
import config from '../config';

test.describe('Test playwright utils', () => {

    test('Login fixture should mock user and roles', async ({ page, login }) => {

        await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD, { customData: { roles: ['sarasa'], first_name: 'Fula', last_name: 'Nito' } });

        await page.goto('/account');

        await expect(page.getByText('Fula')).toBeVisible();
        await expect(page.getByText('Nito')).toBeVisible();
        await expect(page.getByText('sarasa')).toBeVisible();
    });
});