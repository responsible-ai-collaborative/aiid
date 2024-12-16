
import { expect } from '@playwright/test';
import { test } from '../utils';
import config from '../config';
import { init } from '../memory-mongo';

test.describe('Login', () => {

  test('Should redirect to the account page if the signup storage key is set',
    async ({ page, skipOnEmptyEnvironment, login }) => {

      await init();

      await page.goto('/');
      await page.evaluate(() => window.localStorage.setItem('signup', '1'));
      
      await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });
      
      await expect(page).toHaveURL('/account/?askToCompleteProfile=1');

      await expect(page.getByTestId('edit-user-modal')).toBeVisible({ timeout: 30000 });

      const localStorage = await page.evaluate(() => window.localStorage);

      expect(localStorage.signup).toBeUndefined();
    }
  );
});