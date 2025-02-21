import { expect } from '@playwright/test';
import { conditionalIntercept, query, test, waitForRequest } from '../../utils';
import { init } from '../../memory-mongo';
import gql from 'graphql-tag';

test.describe('Checklists App Form', () => {
    const url = '/apps/checklists?id=testChecklist';

    const defaultChecklist = {
        __typename: 'Checklist',
        about: '',
        id: 'testChecklist',
        name: 'Test Checklist',
        owner_id: 'a-fake-user-id-that-does-not-exist',
        risks: [],
        tags_goals: [],
        tags_methods: [],
        tags_other: [],
    };

    const defaultRisk = { 
      "generated": false,
      "id": "7876ca98-ca8a-4365-8c39-203474c1dc38",
      "likelihood": "",
      "precedents": [
        { "description": "",
          "incident_id": 287,
          "tags": ["GMF:Known AI Technical Failure:Distributional Artifacts"],
          "title": "OpenAI’s GPT-3 Reported as Unviable in Medical Tasks by Healthcare Firm"
        }
      ],
      "risk_notes": "",
      "risk_status": "Mitigated",
      "severity": "Minor",
      "tags": ["GMF:Known AI Technical Failure:Distributional Artifacts"],
      "title": "Distributional Artifacts",
      "touched": false
    };

    test('Should have read-only access for non-logged-in users', async ({ page }) => {

        await init({ aiidprod: { checklists: [defaultChecklist] } }, { drop: true });

        await page.goto(url);

        await expect(page.getByText('Test Checklist')).toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] textarea:not([disabled])')).not.toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] input:not([disabled]):not([readonly])')).not.toBeVisible();
    });

    test('Should have read-only access for logged-in non-owners', async ({ page, login }) => {

        await login();

        await init({ aiidprod: { checklists: [defaultChecklist] } }, { drop: true });

        await page.goto(url);

        await expect(page.getByText('Test Checklist')).toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] textarea:not([disabled])')).not.toBeVisible();
        await expect(page.locator('[data-cy="checklist-form"] input:not([disabled]):not([readonly])')).not.toBeVisible();
    });

    test('Should allow editing for owner', async ({ page, login }) => {

        const [userId] = await login();

        await init({ aiidprod: { checklists: [{ ...defaultChecklist, owner_id: userId }] } }, { drop: true });

        await page.goto(url);

        await expect(page.getByText('Test Checklist')).toBeVisible();


        const response = page.waitForResponse((response) => response.request()?.postDataJSON()?.variables?.checklist?.about === 'It\'s a system that does something probably.');

        await page.locator('[data-cy="about"]').fill("It's a system that does something probably.");

        await response;

        const { data } = await query({
            query: gql`
            {
                checklists {
                    about
                }
            }
        `,
        });

        expect(data).toMatchObject({ checklists: [{ about: "It's a system that does something probably." }] });
    });

    test('Should trigger GraphQL upsert query on adding tag', async ({ page, login }) => {

        const [userId] = await login();

        await init({ aiidprod: { checklists: [{ ...defaultChecklist, owner_id: userId }] } }, { drop: true });

        await page.goto(url);


        const response = page.waitForResponse((response) => response.request()?.postDataJSON()?.operationName === 'upsertChecklist');

        await page.locator('#tags_goals_input').fill('Question Answering');
        await page.locator('#tags_goals').click();

        await response;
    });

    test('Should trigger GraphQL update on removing tag', async ({ page, login }) => {

        const [userId] = await login();

        await init({ aiidprod: { checklists: [{ ...defaultChecklist, owner_id: userId, tags_goals: ['GMF:Known AI Goal:Code Generation'] }] } }, { drop: true });

        await page.goto(url);

        const response = page.waitForResponse((response) => response.request()?.postDataJSON()?.operationName === 'upsertChecklist');

        await page.locator('[option="GMF:Known AI Goal:Code Generation"] .close').click();

        await response;
    });

    test('Should trigger UI update on adding and removing tag', async ({ page, login }) => {

        const [userId] = await login();

        await init({ aiidprod: { checklists: [{ ...defaultChecklist, owner_id: userId }] } }, { drop: true });

        await page.goto(url);

        await page.locator('#tags_methods_input').fill('Transformer');
        await page.locator('#tags_methods').click();


        await expect(page.locator('details').first()).toBeVisible();

        await page.locator('.rbt-close').click();

        await expect(page.locator('details')).not.toBeVisible();
    });

    test('Should change sort order of risk items', async ({ page, login }) => {

        await init();

        const [userId] = await login();

        await page.setViewportSize({ width: 1920, height: 1080 });

        await page.goto(url);

        await page.locator('text=Mitigated').first().click();
        await expect(page.locator('details:nth-child(2)')).toContainText('Distributional Bias');

        await page.locator('text=Minor').first().click();
        await expect(page.locator('details:nth-child(2)')).toContainText('Dataset Imbalance');
    });

    test('Should remove a manually-created risk', async ({ page, login }) => {

        const [userId] = await login();

        await init({ 
          aiidprod: { 
            checklists: [
              { ...defaultChecklist, 
                owner_id: userId, 
                risks: [ defaultRisk ]
              }
            ] 
          } 
        }, { drop: true });

        await page.goto(url);

        page.on('dialog', (dialog) => dialog.accept());

        await expect(page.locator('[data-testid="Distributional Artifacts"]')).toHaveCount(1);

        await page.getByTestId('delete-risk').click();

        await expect(page.locator('[data-testid="Distributional Artifacts"]')).toHaveCount(0);
      });

      test('Should persist open state on editing query', async ({ page, login }) => {

        const [userId] = await login();

        await init({ 
          aiidprod: { 
            checklists: [
              { ...defaultChecklist, 
                owner_id: userId, 
                risks: [ defaultRisk ]
              }
            ] 
          } 
        }, { drop: true });

        await page.goto(url);

        await waitForRequest('findChecklist');
        await waitForRequest('risks');

        await page.locator('text=Distributional Artifacts').first().click();

        await page.locator('[data-cy="risk_query-container"] .rbt-input-main').first().fill('CSETv1:Physical Objects:no');

        await page.locator('[aria-label="CSETv1:Physical Objects:no"]').click();

        await expect(page.locator('details').first()).toHaveAttribute('open', '');
    });
});
