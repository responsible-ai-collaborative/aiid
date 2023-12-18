import { conditionalIt } from '../../support/utils';

describe('The Database Snapshots Page', () => {
  const url = '/research/snapshots';

  conditionalIt(Cypress.env('snapshotsEnabled'), 'Successfully loads', () => {
    cy.visit(url);
  });

  conditionalIt(
    !Cypress.env('isEmptyEnvironment') && Cypress.env('snapshotsEnabled'),
    'Should display a list of snapshots to download',
    () => {
      cy.visit(url);

      cy.get('[data-cy="snapshots-list"] li')
        .should('exist')
        .and('be.visible')
        .and('have.length.gt', 0);

      cy.get('[data-cy="snapshots-list"] li').each((item) => {
        expect(item[0].innerText).to.match(
          /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2} (AM|PM) · \d+(\.\d{2})? MB · backup-\d{14}\.tar\.bz2$/
        );

        expect(item.find('a').attr('href')).to.match(/^https:\/\/.*\/backup-\d{14}\.tar\.bz2$/);
      });
    }
  );
});
