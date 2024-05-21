describe('Navigation', { retries: { runMode: 4 } }, () => {
  it('Check menu links work (English)', () => {
    cy.visit('/');

    cy.waitForStableDOM();

    checkLinks();
  });

  it('Check menu links work (Spanish)', () => {
    cy.visit('/es/');

    cy.waitForStableDOM();

    checkLinks();
  });

  it('Check menu links work (French)', () => {
    cy.visit('/fr/');

    cy.waitForStableDOM();

    checkLinks();
  });

  const checkLinks = () => {
    cy.get('.item.active').each((page) => {
      cy.visit(page.prop('href'));

      cy.waitForStableDOM();

      // Check if the sidebar active item match the current page
      cy.get('.active[data-cy="sidebar-link-active"]', { timeout: 10000 })
        .first()
        .should('have.attr', 'href')
        .then((href) => expect(page.prop('href').endsWith(href)).to.be.true);
    });
  };

  it('Check right sidebar "Contents" layout', () => {
    cy.viewport(1280, 800);
    cy.visit('/');

    cy.get('#main-footer').contains('About').click();

    cy.waitForStableDOM();

    cy.get('.rightSideTitle').contains('CONTENTS').should('be.visible');
    cy.get('.rightSideBarUL li').should('have.length.at.least', 1);

    cy.get(
      '[data-cy="sidebar-desktop"] > #sidebar > [data-cy="sidebar-tree"] > [data-cy="sidebar-welcome"] > [data-cy="sidebar-link"]'
    ).click();

    cy.waitForStableDOM();

    cy.get('.rightSideTitle').should('not.exist');
  });

  it('Check right sidebar "Contents" scroll-to section on click on docs', () => {
    cy.viewport(1280, 800);

    cy.visit('/');

    cy.waitForStableDOM();

    cy.get('#main-footer')
      .contains('About')
      .then(($el) => {
        if ($el.length > 0) {
          cy.get('#main-footer').contains('About').click();

          cy.disableSmoothScroll();
          cy.waitForStableDOM();

          cy.get('.rightSideTitle').contains('CONTENTS').should('be.visible');
          cy.get('.rightSideBarUL li').should('have.length.at.least', 1);

          cy.get('.rightSideBarUL li').eq(1).click();
          cy.waitForStableDOM();

          cy.contains('h2', 'Why "AI Incidents"?', { timeout: 8000 }).then((subject) => {
            expect(subject[0].getBoundingClientRect().top).to.be.closeTo(0, 30);
          });
        }
      });
  });

  it('Check right sidebar "Contents" scroll-to section on click on prismic blog post', () => {
    cy.viewport(1280, 800);
    cy.visit('/blog');

    cy.disableSmoothScroll();
    cy.waitForStableDOM();

    cy.get('h5')
      .contains('AI Incident Roundup – January ‘24')
      .then(($el) => {
        if ($el.length > 0) {
          cy.get('h5').contains('AI Incident Roundup – January ‘24').click();

          cy.get('.rightSideTitle').contains('CONTENTS').should('be.visible');
          cy.get('.rightSideBarUL li').should('have.length.at.least', 1);

          cy.get('.rightSideBarUL li').eq(1).click();
          cy.waitForStableDOM();

          cy.contains('h2', '🗄 Trending in the AIID', { timeout: 8000 }).then((subject) => {
            expect(subject[0].getBoundingClientRect().top).to.be.closeTo(0, 30);
          });
        }
      });
  });
});
