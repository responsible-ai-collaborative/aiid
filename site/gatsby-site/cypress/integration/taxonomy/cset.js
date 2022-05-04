const { gql } = require('@apollo/client');

describe('The CSET taxonomy page', () => {
  const url = '/taxonomy/cset';

  it('successfully loads', () => {
    cy.visit(url);
  });

  it('Should render CSET fields list and Searchable status', () => {
    cy.visit(url);

    cy.query({
      query: gql`
        {
          taxa(query: { namespace_in: ["CSET"] }) {
            namespace
            field_list {
              short_name
              instant_facet
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
            (entry) => (entry.public === null || entry.public) && entry.short_name === 'Publish'
          );
        }
      )
      .then((field_list) => {
        cy.get('[data-cy*="field-"]').should('have.length', field_list.length);

        field_list.forEach((field) => {
          cy.contains('h1', field.short_name)
            .should('exist')
            .contains('span', 'Searchable in Discover App')
            .should(field.instant_facet ? 'exist' : 'not.exist');
        });
      });
  });
});
