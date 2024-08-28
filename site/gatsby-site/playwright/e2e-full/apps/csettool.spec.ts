import { expect } from '@playwright/test';
import { query, test } from '../../utils';
import gql from 'graphql-tag';
import { init } from '../../memory-mongo';

test.describe('CSET tool', () => {
    const url = '/apps/csettool/2/';

    async function getRow(page, short_name: string, index = 0) {
        return page.locator(`[data-cy="column-${short_name}"]`).nth(index).locator('..').locator('..');
    }

    test('Successfully loads CSET annotator classifications', async ({ page, login }) => {

        await init();

        await login(process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD, { customData: { roles: ['admin'] } });

        await page.goto(url);
        await page.waitForSelector('[data-cy="column-Incident Number"]');

        const incidentRow = await getRow(page, 'Incident Number');
        await expect(incidentRow.locator('[data-cy="column-CSETv1_Annotator-1"]')).toHaveText('2');
        await expect(incidentRow.locator('[data-cy="column-CSETv1_Annotator-1"]')).not.toHaveClass('bg-green-100');
        await expect(incidentRow.locator('[data-cy="column-CSETv1_Annotator-2"]')).toHaveText('2');
        await expect(incidentRow.locator('[data-cy="column-CSETv1_Annotator-2"]')).not.toHaveClass('bg-green-100');
        await expect(incidentRow.locator('[data-cy="column-result"]')).toHaveText('2');
        await expect(incidentRow.locator('[data-cy="column-result"]')).toHaveClass(/bg\-green\-100/);

        const annotatorRow = await getRow(page, 'Annotator');
        await expect(annotatorRow.locator('[data-cy="column-CSETv1_Annotator-1"]')).toHaveText('"005"');
        await expect(annotatorRow.locator('[data-cy="column-CSETv1_Annotator-1"]')).toHaveClass(/bg\-red\-100/);
        await expect(annotatorRow.locator('[data-cy="column-CSETv1_Annotator-2"]')).toHaveText('"001"');
        await expect(annotatorRow.locator('[data-cy="column-CSETv1_Annotator-2"]')).toHaveClass(/bg\-red\-100/);
        await expect(annotatorRow.locator('[data-cy="column-result"]')).toHaveText('skipped');

        const physicalObjectsRow = await getRow(page, 'Physical Objects');
        await expect(physicalObjectsRow.locator('[data-cy="column-CSETv1_Annotator-1"]')).toHaveText('"no"');
        await expect(physicalObjectsRow.locator('[data-cy="column-CSETv1_Annotator-1"]')).toHaveClass(/bg\-red\-100/);
        await expect(physicalObjectsRow.locator('[data-cy="column-CSETv1_Annotator-2"]')).toHaveText('"maybe"');
        await expect(physicalObjectsRow.locator('[data-cy="column-CSETv1_Annotator-2"]')).toHaveClass(/bg\-red\-100/);
        await expect(physicalObjectsRow.locator('[data-cy="column-result"]')).toHaveText('Please select a column');

        // Disambiguate and submit
        await (await getRow(page, 'Physical Objects')).locator('[data-cy="column-CSETv1_Annotator-1"]').click();
        await (await getRow(page, 'AI System Description')).locator('[data-cy="column-CSETv1_Annotator-1"]').click();


        await page.getByText('Merge Classifications').click();

        await expect(page.getByText('Classification updated ')).toBeVisible();


        const { data: { classifications } } = await query({
            query: gql`
                query ($filter: ClassificationFilterType) {
                    classifications(filter: $filter) {                    
                        namespace
                        incidents {
                            incident_id
                        }
                        reports {
                            report_number
                        }
                        attributes {
                            short_name
                            value_json      
                        }
                    }
                }`,
            variables: {
                "filter": {
                    "namespace": {
                        "EQ": "CSETv1"
                    },
                    "incidents": {
                        "EQ": 2
                    }
                }
            }
        })

        expect(classifications).toMatchObject([
            {
                namespace: 'CSETv1',
                incidents: [
                    { incident_id: 2 }
                ],
                reports: [],
            }
        ]);
    });
});