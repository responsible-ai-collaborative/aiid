
import { gql } from '@apollo/client';
import { query, test } from '../utils';
import { expect } from '@playwright/test';

test('Should retrieve a risk by query tag', async () => {
  const result = await query({
    query: gql`
      {
        risks(input: { tags: ["GMF:Known AI Technical Failure:Distributional Bias"] }) {
          tag
          precedents {
            title
            incident_id
            description
          }
        }
      }
    `
  });

  const { risks } = result.data;
  const failureTag = 'GMF:Known AI Technical Failure:Distributional Bias';
  const risk = risks.find((r) => r.tag === failureTag);
  const precedent = risk.precedents.find((p) => p.incident_id === 1);

  expect(precedent).not.toBeNull();
  expect(precedent.title.length > 0).toBe(true);
  expect(precedent.description.length > 0).toBe(true);
});

test('Should retrieve risks with no tag provided.', async () => {
  const result = await query({
    query: gql`
      {
        risks {
          tag
          precedents {
            title
            incident_id
            description
          }
        }
      }
    `
  });

  const { risks } = result.data;
  const queryTag = 'GMF:Known AI Technical Failure:Distributional Bias';
  const risk = risks.find((r) => r.tag === queryTag);
  const precedent = risk.precedents.find((p) => p.incident_id === 1);

  expect(precedent).not.toBeNull();
  expect(precedent.title.length > 0).toBe(true);
  expect(precedent.description.length > 0).toBe(true);
});
