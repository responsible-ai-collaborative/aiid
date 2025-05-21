
// filepath: /Users/cesarvarela/projects/dsri/aiid/site/gatsby-site/playwright/e2e/incidentLinks.spec.ts
import { expect } from '@playwright/test';
import { test } from '../utils';
import incident_links from '../seeds/aiidprod/incident_links';

test.describe('Incident Links', () => {

    const incidentId = 1;
    const url = `/cite/${incidentId}`;

    test('Successfully loads and displays incident links', async ({ page }) => {

        await page.goto(url);

        const linksForIncident1 = incident_links.filter(link => link.incident_id === incidentId);

        expect(linksForIncident1.length).toBeGreaterThan(0);

        for (const link of linksForIncident1) {
            const linkSelector = `a[href="${link.sameAs}"]`;
            await expect(page.locator(linkSelector)).toBeVisible();
        }
    });
});
