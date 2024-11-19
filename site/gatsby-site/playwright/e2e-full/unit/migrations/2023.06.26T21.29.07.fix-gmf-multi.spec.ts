import { expect } from '@playwright/test';
import { up } from '../../../../migrations/2023.06.26T21.29.07.fix-gmf-multi';
import { test } from '../../../utils';
import sinon from 'sinon';

const classification_1 = {
  _id: { $oid: '63ff9df8b8231a8c28674ad3' },
  notes: '',
  publish: false,
  incident_id: { $numberInt: '100' },
  namespace: 'CSETv1',
  attributes: [
    { short_name: 'String', value_json: '"just a string"' },
    {
      short_name: 'Entities with nested values',
      value_json: JSON.stringify([
        {
          attributes: [
            {
              short_name: 'should be ignored',
              value_json: '"Lucie Inland"',
            },
            {
              short_name: 'Entity Relationship to the AI',
              value_json: JSON.stringify([
                'string value',
                {
                  customOption: true,
                  label: 'broken item',
                  id: 'new-id-1',
                },
              ]),
            },
          ],
        },
      ]),
    },
    {
      short_name: 'Mixed string list',
      value_json: JSON.stringify([
        'item 1',
        'item 2',
        {
          customOption: true,
          label: 'broken item',
          id: 'new-id-1',
        },
      ]),
    },
    {
      short_name: 'Pure string list',
      value_json: JSON.stringify(['item 1', 'item 2']),
    },
  ],
};

test('Should convert existing classifications to string', async ({ page }) => {
  const classificationsCollection = {
    find: sinon.stub().returns({
      hasNext: sinon.stub().onFirstCall().resolves(true).onSecondCall().resolves(false),
      next: sinon.stub().onFirstCall().resolves(classification_1),
    }),
    updateOne: sinon.stub().resolves({}),
  };

  const context = {
    client: {
      connect: sinon.stub().resolves(),
      db: sinon.stub().returns({
        collection: sinon.stub().callsFake((name) => {
          if (name === 'classifications') return classificationsCollection;
          return undefined;
        }),
      }),
    },
  };

  await up({ context });

  const firstCallAttributes = classificationsCollection.updateOne.firstCall.args[1].$set.attributes;

  expect(firstCallAttributes[0]).toEqual({
    short_name: 'String',
    value_json: '"just a string"',
  });

  expect(firstCallAttributes[1]).toEqual({
    short_name: 'Entities with nested values',
    value_json: JSON.stringify([
      {
        attributes: [
          {
            short_name: 'should be ignored',
            value_json: '"Lucie Inland"',
          },
          {
            short_name: 'Entity Relationship to the AI',
            value_json: JSON.stringify(['string value', 'broken item']),
          },
        ],
      },
    ]),
  });

  expect(firstCallAttributes[2]).toEqual({
    short_name: 'Mixed string list',
    value_json: JSON.stringify(['item 1', 'item 2', 'broken item']),
  });

  expect(firstCallAttributes[3]).toEqual({
    short_name: 'Pure string list',
    value_json: JSON.stringify(['item 1', 'item 2']),
  });
});
