import { expect } from '@playwright/test';
import { test } from '../utils';
import config from '../config';

test.describe('Test playwright utils', () => {

    test('Login fixture should mock user and roles', async ({ page, login }) => {

        await login({ customData: { roles: ['sarasa'], first_name: 'Fula', last_name: 'Nito' } });

        await page.goto('/account');

        const table = page.locator('[data-cy="details-table"]');
        await expect(table.getByText('Fula')).toBeVisible();
        await expect(table.getByText('Nito')).toBeVisible();
        await expect(table.getByText('sarasa')).toBeVisible();
    });
});