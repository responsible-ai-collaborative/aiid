const { gql } = require('@apollo/client');

describe('Risks', () => {
  it('Should retrieve a risk by query tag', () => {
    cy.query({
      query: gql`
        {
          risks(input: { tags: ["GMF:Known AI Technology:Content-based Filtering"] }) {
            tag
            precedents {
              title
              incident_id
              description
            }
          }
        }
      `,
      timeout: 60000, // mongodb admin api is extremely slow
    }).then(({ data: { risks } }) => {
      const failureTag = 'GMF:Known AI Technical Failure:Adversarial Data';

      const risk = risks.find((r) => r.tag == failureTag);

      const precedent = risk.precedents.find((p) => p.incident_id == 1);

      cy.expect(precedent).not.to.be.null;
      cy.expect(precedent.title.length > 0).to.be.true;
      cy.expect(precedent.description.length > 0).to.be.true;
    });
  });

  it('Should retrieve risks with no tag provided.', () => {
    cy.query({
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
      `,
      timeout: 60000, // mongodb admin api is extremely slow
    }).then(({ data: { risks } }) => {
      const queryTag = 'GMF:Known AI Technical Failure:Adversarial Data';

      const risk = risks.find((r) => r.tag == queryTag);

      const precedent = risk.precedents.find((p) => p.incident_id == 1);

      cy.expect(precedent).not.to.be.null;
      cy.expect(precedent.title.length > 0).to.be.true;
      cy.expect(precedent.description.length > 0).to.be.true;
    });
  });
});
