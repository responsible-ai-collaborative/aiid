const findSystems = require('../../../../../realm/functions/findSystems');

describe('Find systems', () => {
  it('Should return a list of incidents and reports', () => {
    const classificationsCollection = {
      find: cy.stub().returns({ toArray: cy.stub().resolves([]) }),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: (() => {
            const stub = cy.stub();

            stub.withArgs('aiidprod').returns({
              collection: (() => {
                const stub = cy.stub();

                stub.withArgs('classifications').returns(classificationsCollection);

                return stub;
              })(),
            });

            return stub;
          })(),
        }),
      },
    };

    cy.wrap(
      findSystems({
        query:
          '{"$or": [{"$and":[{"attributes":{"$elemMatch":{"short_name":"Full Description","value":{"$regex":"google","$options":"i"}}}},{"attributes":{"$elemMatch":{"short_name":"Beginning Date","value":{"$eq":"2023-09-05"}}}}]}]}',
      })
    ).then(() => {
      const expected = {
        $or: [
          {
            $and: [
              {
                attributes: {
                  $elemMatch: {
                    short_name: 'Full Description',
                    value: { $regex: 'google', $options: 'i' },
                  },
                },
              },
              {
                attributes: {
                  $elemMatch: {
                    short_name: 'Beginning Date',
                    value: { $eq: new Date('2023-09-05') },
                  },
                },
              },
            ],
          },
        ],
      };

      expect(classificationsCollection.find.firstCall.args[0]).to.deep.eq(expected);
    });
  });
});
