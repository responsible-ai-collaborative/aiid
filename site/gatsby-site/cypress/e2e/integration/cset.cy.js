const { gql } = require('@apollo/client');

describe('The CSET taxonomy page', () => {
  const urls = [
    { namespace: 'CSETv0', url: '/taxonomy/csetv0' },
    { namespace: 'CSETv1', url: '/taxonomy/csetv1' },
  ];

  urls.forEach(({ namespace, url }) => {
    it(`successfully loads ${namespace}`, () => {
      cy.visit(url);
    });

    it(`Should render ${namespace} fields list and Searchable status`, () => {
      cy.visit(url);

      cy.waitForStableDOM();

      cy.query({
        query: gql`
        {
          taxa(query: { namespace_in: ["${namespace}"] }) {
            namespace
            field_list {
              long_name
              short_name
              instant_facet
              public
            }
          }
        }
      `,
      })
        .then(
          ({
            data: {
              taxa: { field_list },
            },
          }) => {
            return field_list.filter(
              (entry) => (entry.public === null || entry.public) && entry.short_name !== 'Publish'
            );
          }
        )
        .then((field_list) => {
          cy.get('[data-cy*="field-"]').should('have.length', field_list.length);

          field_list.forEach((field) => {
            cy.contains('h3', field.long_name.replace(/\s{2,}/g, ' '))
              .should('exist')
              .contains('span', 'Searchable in Discover App')
              .should(field.instant_facet ? 'exist' : 'not.exist');
          });
        });
    });
  });
});
