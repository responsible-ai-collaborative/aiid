import { expect, Page } from '@playwright/test';
import { gql } from '@apollo/client';
import { query, test } from '../../utils';

const urls = [
  { namespace: 'CSETv0', url: '/taxonomy/csetv0' },
  { namespace: 'CSETv1', url: '/taxonomy/csetv1' },
];

urls.forEach(({ namespace, url }) => {
  test(`successfully loads ${namespace}`, async ({ page }) => {
    await page.goto(url);
  });

  if (namespace === 'CSETv0') {
    test(`Should render ${namespace} fields list and Searchable status`, async ({ page }) => {
      await page.goto(url);

      const fieldListQuery = gql`
        {
          taxa(filter: { namespace: {IN: ["${namespace}"] }  }) {
            namespace
            field_list {
              long_name
              short_name
              instant_facet
              public
            }
          }
        }
      `;

      const result = await query({
        query: fieldListQuery,
      });

      const field_list = result.data.taxa.field_list.filter(
        (entry) => (entry.public === null || entry.public) && entry.short_name !== 'Publish'
      );

      await expect(page.locator('[data-cy*="field-"]')).toHaveCount(field_list.length);

      for (const field of field_list) {
        const fieldLocator = page.locator('h3', { hasText: field.long_name.replace(/\s{2,}/g, ' ') });
        await expect(fieldLocator).toBeVisible();

        const searchableLocator = fieldLocator.locator('span', { hasText: 'Searchable in Discover App' });
        if (field.instant_facet) {
          await expect(searchableLocator.first()).toBeVisible();
        } else {
          await expect(searchableLocator.first()).not.toBeVisible();
        }
      }
    });
  }
});
