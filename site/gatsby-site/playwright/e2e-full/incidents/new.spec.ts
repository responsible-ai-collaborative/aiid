import { test, conditionalIntercept, waitForRequest, query, fillAutoComplete } from '../../utils';
import { init } from '../../memory-mongo';

test.describe('New Incident page', () => {
  const url = '/incidents/new';

  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
  });

  test('Should successfully create a new incident', async ({ page, login }) => {

    await init();

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

    await page.goto(url);

    const values = {
      title: 'Test title',
      description: 'Test description',
      date: '2021-01-02',
    };

    for (const [key, value] of Object.entries(values)) {
      await page.locator(`[name=${key}]`).fill(value);
    }

    await page.locator('[data-cy="alleged-deployer-of-ai-system-input"] input').first().fill('Test Deployer');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="alleged-developer-of-ai-system-input"] input').first().fill('youtube');
    await page.keyboard.press('Enter');
    await page.locator('[data-cy="alleged-harmed-or-nearly-harmed-parties-input"] input').first().fill('children');
    await page.keyboard.press('Enter');

    await fillAutoComplete(page, '#input-editors', 'Joh', 'John Doe');

    await conditionalIntercept(page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'logIncidentHistory',
      { data: { logIncidentHistory: { incident_id: 4 } } },
      'logIncidentHistory'
    );

    await page.getByText('Save').click();

    await waitForRequest('logIncidentHistory');

    await page.getByText(`You have successfully create Incident 4. View incident`).waitFor();
  });

  test('Should clone an incident', async ({ page, login }) => {

    await init();

    await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'], first_name: 'John', last_name: 'Doe' } });

    const newIncidentId = 4;

    await page.goto(`${url}/?incident_id=3`);

    await conditionalIntercept(
      page,
      '**/graphql',
      (req) => req.postDataJSON().operationName == 'logIncidentHistory',
      { data: { logIncidentHistory: { incident_id: newIncidentId } } },
      'logIncidentHistory'
    );

    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.getByText('Save').click();

    await waitForRequest('logIncidentHistory');

    await page.getByText(`You have successfully create Incident ${newIncidentId}. View incident`).waitFor();
  });
});
