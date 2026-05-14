import { expect } from '@playwright/test';
import { conditionalIntercept, waitForRequest, test } from '../utils';
import { format } from 'date-fns';

const now = new Date();

test.describe('The Quick Add form', () => {
  test('Should submit a report through the Quick Add form', async ({ page }) => {
    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'InsertQuickAdd',
      { data: { insertOneQuickadd: { __typename: 'Quickadd', _id: '6271a62068d0c59a372b0c09' } } },
      'InsertQuickAdd'
    );

    await page.goto('/apps/submit');
    await page.locator('[data-cy="quick-add"] [name="quickAddUrl"]').fill('https://example.com');
    await page.locator('[data-cy="quick-add"] [type="submit"]').click();

    const insertQuickAddRequest = await waitForRequest('InsertQuickAdd');
    const variables = insertQuickAddRequest.postDataJSON().variables;
    expect(variables.data.url).toBe('https://example.com/');
    expect(variables.data.date_submitted).toBe(format(now, 'yyyy-MM-dd'));

    await expect(page.locator('.tw-toast')).toContainText('Report successfully added to review queue. You can see your submission here.');
  });
});
