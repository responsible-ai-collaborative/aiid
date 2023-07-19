const styleObject = (styleString) => {
  const obj = {};

  styleString
    .split(';')
    .map((rule) => rule.split(':').map((part) => part.trim()))
    .forEach((rule) => {
      obj[rule[0]] = rule[1];
    });

  return obj;
};

describe('TSNE Visualization', () => {
  const url = '/summaries/spatial';

  it.skip('Should render the TSNE visualization', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"]').should('exist');
  });

  it.skip('Should highlight source incident when one exists', () => {
    cy.visit(url + '?incident=1');
    cy.get('[data-cy="tsne-visualization"] [data-cy="tsne-plotpoint"].current')
      .should('exist')
      .should('be.visible');
  });

  it.skip('Should show an incident card on hover', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"] #spatial-incident-1').trigger('mouseover');
    cy.get('[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"]').should(
      'be.visible'
    );
  });

  it.skip('Incident card should show title', () => {
    cy.visit(url);
    cy.get('[data-cy="tsne-visualization"] #spatial-incident-1').trigger('mouseover');
    cy.get(
      '[data-cy="tsne-visualization"] #spatial-incident-1 + [data-cy="incident-card"] [data-cy="title"]'
    ).should('be.visible');
  });

  it.skip('Should change the plotpoint color when the axis selection changes', () => {
    cy.visit(url);

    let initialBackground;

    cy.get('[data-cy="tsne-visualization"] #spatial-incident-1[data-cy-background]')
      .should('have.attr', 'style')
      .as('initialStyle');

    cy.get('@initialStyle').should((s) => {
      initialBackground = styleObject(s).background;
    });

    cy.get('[data-cy="color-axis-select"]').select('Harm Distribution Basis');

    cy.get('[data-cy="tsne-visualization"] #spatial-incident-1')
      .should('have.attr', 'style')
      .as('newStyle');

    cy.get('@newStyle').should((newStyle) => {
      expect(styleObject(newStyle).background).to.not.eq(initialBackground);
    });
  });
});
