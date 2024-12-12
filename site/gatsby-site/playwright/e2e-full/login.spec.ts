
import { expect } from '@playwright/test';
import { test } from '../utils';
import config from '../config';
import { init } from '../memory-mongo';

test.describe('Login', () => {

  test('Should redirect to the account page if the signup storage key is set',
    async ({ page, skipOnEmptyEnvironment, login }) => {

      await page.goto('/');
      await page.evaluate(() => window.localStorage.setItem('signup', '1'));

      const userId = await login(config.E2E_ADMIN_USERNAME, config.E2E_ADMIN_PASSWORD);
      
      await init({ customData: { users: [{ userId, first_name: 'Test', last_name: 'User', roles: ['admin'] }] } }, { drop: true });

      await expect(page).toHaveURL('/account/?askToCompleteProfile=1');

      await expect(page.getByTestId('edit-user-modal')).toBeVisible({ timeout: 30000 });

      const localStorage = await page.evaluate(() => window.localStorage);

      expect(localStorage.signup).toBeUndefined();
    }
  );
});