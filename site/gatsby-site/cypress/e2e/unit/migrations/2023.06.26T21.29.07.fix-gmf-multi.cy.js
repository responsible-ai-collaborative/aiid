const { up } = require('../../../../migrations/2023.06.26T21.29.07.fix-gmf-multi');

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

describe('Functions', () => {
  it('Should convert existing classifications to string', () => {
    const classificationsCollection = {
      find: cy.stub().returns({
        hasNext: cy.stub().onFirstCall().resolves(true).onSecondCall().resolves(false),
        next: cy.stub().onFirstCall().resolves(classification_1),
      }),
      updateOne: cy.stub().resolves({}),
    };

    const context = {
      client: {
        connect: cy.stub().resolves(),

        db: cy.stub().returns({
          collection: (() => {
            const stub = cy.stub();

            stub.withArgs('classifications').returns(classificationsCollection);

            return stub;
          })(),
        }),
      },
    };

    cy.wrap(up({ context })).then(() => {
      expect(
        classificationsCollection.updateOne.firstCall.args[1].$set.attributes[0]
      ).to.deep.equal({
        short_name: 'String',
        value_json: '"just a string"',
      });

      expect(
        classificationsCollection.updateOne.firstCall.args[1].$set.attributes[1]
      ).to.deep.equal({
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

      expect(
        classificationsCollection.updateOne.firstCall.args[1].$set.attributes[2]
      ).to.deep.equal({
        short_name: 'Mixed string list',
        value_json: JSON.stringify(['item 1', 'item 2', 'broken item']),
      });

      expect(
        classificationsCollection.updateOne.firstCall.args[1].$set.attributes[3]
      ).to.deep.equal({
        short_name: 'Pure string list',
        value_json: JSON.stringify(['item 1', 'item 2']),
      });
    });
  });
});
