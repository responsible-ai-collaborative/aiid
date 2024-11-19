import { expect } from '@playwright/test';
import { up } from '../../../../migrations/2023.09.26T19.12.20.fix-cset-migration';
import classifications from '../../../fixtures/classifications/missingAttributes.json';
import taxaV1 from '../../../fixtures/taxa/csetV1.json';
import taxaV1Annotator3 from '../../../fixtures/taxa/CSETv1_Annotator-3.json';
import { test } from '../../../utils';
import sinon from 'sinon';

test('Should migrate fields to new names', async ({ page }) => {
  const classificationsCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves(classifications),
    }),
    updateOne: sinon.stub().resolves({}),
  };

  const taxaCollection = {
    find: sinon.stub().returns({
      toArray: sinon.stub().resolves([taxaV1, taxaV1Annotator3]),
    }),
  };

  const context = {
    client: {
      connect: sinon.stub().resolves(),
      db: sinon.stub().returns({
        collection: sinon.stub().callsFake((name) => {
          if (name === 'classifications') return classificationsCollection;
          if (name === 'taxa') return taxaCollection;
          return undefined;
        }),
      }),
    },
  };

  await up({ context });

  sinon.assert.callCount(classificationsCollection.updateOne, 2);

  // First call
  sinon.assert.calledWithMatch(classificationsCollection.updateOne.firstCall, {
    _id: { $oid: '648faecdf5ee4963902350e2' },
  });

  const firstCallAttributes =
    classificationsCollection.updateOne.firstCall.args[1].$set.attributes;

  const c1 = classifications.find((c) => c._id.$oid === '648faecdf5ee4963902350e2');

  expect(firstCallAttributes.find((a) => a.short_name === 'Clear Link to AI')).toBeUndefined();
  expect(firstCallAttributes.find((a) => a.short_name === 'Clear link to technology')).toBeDefined();
  expect(
    c1.attributes.find((a) => a.short_name === 'Clear Link to AI').value_json
  ).toEqual(
    firstCallAttributes.find((a) => a.short_name === 'Clear link to technology').value_json
  );

  // Second call
  sinon.assert.calledWithMatch(classificationsCollection.updateOne.secondCall, {
    _id: { $oid: '63f3d2cface82aca35c26da3' },
  });

  const secondCallAttributes =
    classificationsCollection.updateOne.secondCall.args[1].$set.attributes;

  const c2 = classifications.find((c) => c._id.$oid === '63f3d2cface82aca35c26da3');

  expect(secondCallAttributes.find((a) => a.short_name === 'Reviewer')).toBeUndefined();
  expect(secondCallAttributes.find((a) => a.short_name === 'Peer Reviewer')).toBeDefined();
  expect(
    c2.attributes.find((a) => a.short_name === 'Reviewer').value_json
  ).toEqual(
    secondCallAttributes.find((a) => a.short_name === 'Peer Reviewer').value_json
  );
});
