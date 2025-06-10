import { expect } from '@playwright/test';
import { test } from '../utils';
import incident_links from '../seeds/aiidprod/incident_links';

test.describe('Incident Links', () => {

    const incidentId = 1;
    const url = `/cite/${incidentId}`;

    test('Successfully loads and displays incident links', async ({ page, login }) => {

        await login();

        await page.goto(url);

        const linksForIncident1 = incident_links.filter(link => link.incident_id === incidentId && link.source_namespace === 'OECD');

        await expect(async () => {
            await page.locator('[data-testid="oecd-btn"] button').click();
            await expect(page.locator('[data-testid="oecd-btn"] ul')).toHaveCount(1, { timeout: 2000 });
        }).toPass();

        for (const link of linksForIncident1) {
            const linkSelector = `a[href="${link.sameAs}"]`;
            const dropdownItem = page.locator(linkSelector);
            await expect(dropdownItem).toBeVisible();
            await expect(dropdownItem).toHaveText(`Report ${link.sameAs.split('/').pop()}`);
        }
    });
});
