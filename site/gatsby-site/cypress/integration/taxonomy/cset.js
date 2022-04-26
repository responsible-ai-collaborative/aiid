describe('The CSET taxonomy page', () => {
  const url = '/taxonomy/cset';

  it('successfully loads', () => {
    cy.visit(url);
  });

  it('Should render CSET fields list and Searchable status', () => {
    cy.visit(url);

    const fields = [
      {
        short_name: 'Full description of the incident',
        instant_facet: false,
      },
      {
        short_name: 'Short description of the incident',
        instant_facet: false,
      },
      {
        short_name: 'Overall severity of harm',
        instant_facet: true,
      },
      {
        short_name: 'Uneven distribution of harms basis',
        instant_facet: true,
      },
      {
        short_name: 'Harm type',
        instant_facet: true,
      },

      {
        short_name: 'Description of AI system involved',
        instant_facet: false,
      },
      {
        short_name: 'System developer',
        instant_facet: true,
      },
      {
        short_name: 'System developer',
        instant_facet: true,
      },
      {
        short_name: 'Sector of deployment',
        instant_facet: true,
      },
      {
        short_name: 'Relevant AI functions',
        instant_facet: true,
      },
      {
        short_name: 'AI tools and techniques used',
        instant_facet: true,
      },
      {
        short_name: 'AI functions and applications used',
        instant_facet: true,
      },
      {
        short_name: 'Location',
        instant_facet: true,
      },
      {
        short_name: 'Named entities',
        instant_facet: true,
      },
      {
        short_name: 'Party responsible for AI system',
        instant_facet: true,
      },
      {
        short_name: 'Beginning date',
        instant_facet: false,
      },
      {
        short_name: 'Ending date',
        instant_facet: false,
      },
      {
        short_name: 'Harm nearly missed?',
        instant_facet: true,
      },
      {
        short_name: 'Probable level of intent',
        instant_facet: true,
      },
      {
        short_name: 'Human lives lost',
        instant_facet: true,
      },
      {
        short_name: 'Critical infrastructure sectors affected',
        instant_facet: true,
      },
      {
        short_name: 'Total financial cost',
        instant_facet: false,
      },
      {
        short_name: 'Laws covering the incident',
        instant_facet: false,
      },
      {
        short_name: 'Description of the data inputs to the AI systems',
        instant_facet: false,
      },
      {
        short_name: 'Public sector deployment',
        instant_facet: true,
      },
      {
        short_name: 'Level of autonomy',
        instant_facet: true,
      },
      {
        short_name: 'Physical system',
        instant_facet: true,
      },
      {
        short_name: 'Causative factors within AI system',
        instant_facet: true,
      },
    ];

    cy.get('[data-cy*="field-"]').should('have.length', fields.length);

    fields.forEach((classification) => {
      cy.contains('h1', classification.short_name)
        .should('exist')
        .contains('span', 'Searchable in Discover App')
        .should(classification.instant_facet ? 'exist' : 'not.exist');
    });
  });
});
