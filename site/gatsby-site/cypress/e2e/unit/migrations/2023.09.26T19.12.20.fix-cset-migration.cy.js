const { up } = require('../../../../migrations/2023.09.26T19.12.20.fix-cset-migration');

import classifications from '../../../fixtures/classifications/missingAttributes.json';
import taxaV1 from '../../../fixtures/taxa/csetV1.json';
import taxaV1Annotator3 from '../../../fixtures/taxa/CSETv1_Annotator-3.json';

describe('Functions', () => {
  it('Should migrate fields to new names', () => {
    const classificationsCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves(classifications),
      }),
      updateOne: cy.stub().resolves({}),
    };

    const taxaCollection = {
      find: cy.stub().returns({
        toArray: cy.stub().resolves([taxaV1, taxaV1Annotator3]),
      }),
    };

    const context = {
      client: {
        connect: cy.stub().resolves(),

        db: cy.stub().returns({
          collection: (() => {
            const stub = cy.stub();

            stub.withArgs('classifications').returns(classificationsCollection);
            stub.withArgs('taxa').returns(taxaCollection);

            return stub;
          })(),
        }),
      },
    };

    cy.wrap(up({ context })).then(() => {
      expect(classificationsCollection.updateOne.getCalls().length).to.eq(2);

      expect(classificationsCollection.updateOne.firstCall.args[0]).to.deep.eq({
        _id: { $oid: '648faecdf5ee4963902350e2' },
      });

      const firstCallAttributes =
        classificationsCollection.updateOne.firstCall.args[1].$set.attributes;

      const c1 = classifications.find((c) => c._id.$oid == '648faecdf5ee4963902350e2');

      expect(firstCallAttributes.find((a) => a.short_name == 'Clear Link to AI')).to.not.exist;
      expect(firstCallAttributes.find((a) => a.short_name == 'Clear link to technology')).to.exist;
      expect(c1.attributes.find((a) => a.short_name == 'Clear Link to AI').value_json).to.eq(
        firstCallAttributes.find((a) => a.short_name == 'Clear link to technology').value_json
      );

      expect(classificationsCollection.updateOne.secondCall.args[0]).to.deep.eq({
        _id: { $oid: '63f3d2cface82aca35c26da3' },
      });

      const secondCallAttributes =
        classificationsCollection.updateOne.secondCall.args[1].$set.attributes;

      const c2 = classifications.find((c) => c._id.$oid == '63f3d2cface82aca35c26da3');

      expect(secondCallAttributes.find((a) => a.short_name == 'Reviewer')).to.not.exist;
      expect(secondCallAttributes.find((a) => a.short_name == 'Peer Reviewer')).to.exist;
      expect(c2.attributes.find((a) => a.short_name == 'Reviewer').value_json).to.eq(
        secondCallAttributes.find((a) => a.short_name == 'Peer Reviewer').value_json
      );
    });
  });
});
