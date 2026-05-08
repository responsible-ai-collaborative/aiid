import { expect } from '@playwright/test';
import { query, test } from '../utils';
import gql from 'graphql-tag';
import { init } from '../memory-mongo';

const url = '/summaries/gallery';

const incidentsWithImagesQuery = gql`
  {
    incidents(sort: { incident_id: ASC }) {
      incident_id
      title
      reports {
        cloudinary_id
        image_url
      }
    }
  }
`;

const hasImage = (incident: any) =>
  incident?.reports?.[0]?.cloudinary_id || incident?.reports?.[0]?.image_url;

test.describe('Incidents Gallery', () => {
  test('Successfully loads', async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('[data-cy="summaries-image-grid"]')).toBeVisible();
  });

  test('Renders one thumbnail per incident with an image', async ({
    page,
    skipOnEmptyEnvironment,
  }) => {
    await init();
    await page.goto(url);

    const {
      data: { incidents },
    } = await query({ query: incidentsWithImagesQuery });

    const expected = incidents.filter(hasImage);

    await expect(page.locator('[data-cy="summaries-image-grid"] > a')).toHaveCount(expected.length);
  });

  test('Each thumbnail links to its incident citation page', async ({
    page,
    skipOnEmptyEnvironment,
  }) => {
    await init();
    await page.goto(url);

    const {
      data: { incidents },
    } = await query({ query: incidentsWithImagesQuery });

    for (const incident of incidents.filter(hasImage)) {
      const link = page.locator(`[data-cy="incident-thumb-${incident.incident_id}"]`);

      await expect(link).toHaveAttribute('href', new RegExp(`/cite/${incident.incident_id}/?$`));
    }
  });

  test('Each thumbnail uses the incident title as alt text and visible label', async ({
    page,
    skipOnEmptyEnvironment,
  }) => {
    await init();
    await page.goto(url);

    const {
      data: { incidents },
    } = await query({ query: incidentsWithImagesQuery });

    for (const incident of incidents.filter(hasImage)) {
      const cell = page.locator(`[data-cy="incident-thumb-${incident.incident_id}"]`);

      const thumbImg = cell.locator('img').first();

      await expect(thumbImg).toHaveAttribute('alt', incident.title);

      await expect(cell).toContainText(incident.title);
    }
  });

  test('Hovering a cell mounts a larger image', async ({ page, skipOnEmptyEnvironment }) => {
    await init();
    await page.goto(url);

    const firstCell = page.locator('[data-cy^="incident-thumb-"]').first();

    await firstCell.waitFor();

    await expect(firstCell.locator('img')).toHaveCount(1);

    await firstCell.hover();

    await expect(firstCell.locator('img')).toHaveCount(2);

    const largeImg = firstCell.locator('img').nth(1);

    await expect(largeImg).toHaveAttribute('src', /c_fill,h_400,w_400/);
  });

  test('Falls back to the AIID logo when the Cloudinary image fails', async ({
    page,
    skipOnEmptyEnvironment,
  }) => {
    await init();

    // The fallback logo is rendered as a CSS background on the inner wrapper, so it is
    // already visible the moment the cell mounts — even before the thumbnail tries to
    // load and even if Cloudinary returns nothing. That's the guarantee we want.
    await page.goto(url);

    const firstCell = page.locator('[data-cy^="incident-thumb-"]').first();

    await firstCell.waitFor();

    const fallbackBg = firstCell.locator('div').first();

    await expect(fallbackBg).toHaveCSS(
      'background-image',
      /\/logos\/AIID_1000x1000px\.png/
    );
  });
});
