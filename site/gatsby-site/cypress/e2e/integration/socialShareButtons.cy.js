describe('Social Share buttons on pages', { retries: { runMode: 4 } }, () => {
  const incidentId = 10;

  const incidentUrl = `/cite/${incidentId}/`;

  const blogPostUrl = `/blog/join-raic`;

  const shareButtonsPerSection = 4;

  const urlsToTest = [
    {
      page: 'Incident',
      url: incidentUrl,
      title:
        'Incident 10: Kronos Scheduling Algorithm Allegedly Caused Financial Issues for Starbucks Employees',
      shareButtonSections: 1,
    },
    {
      page: 'Blog Post',
      url: blogPostUrl,
      title: `Join the Responsible AI Collaborative Founding Staff`,
      shareButtonSections: 1,
    },
  ];

  urlsToTest.forEach(({ page, url, title, shareButtonSections }) => {
    it(`${page} page should have ${shareButtonSections} Social Share button sections`, () => {
      cy.visit(url);

      cy.get('[data-cy=social-share-buttons]', { timeout: 8000 })
        .find('button')
        .should('have.length', shareButtonSections * shareButtonsPerSection);
    });

    const canonicalUrl = `https://incidentdatabase.ai${url}`;

    // Twitter share
    it(`${page} page should have a Twitter share button`, () => {
      cy.visit(url);

      cy.get('[data-cy=btn-share-twitter]').should('exist');
      cy.window().then((win) => {
        cy.stub(win, 'open')
          .callsFake((url) => {
            win.location.href = url;
          })
          .as('popup_twitter');
      });

      cy.waitForStableDOM();

      cy.get('[data-cy=btn-share-twitter]').first().click();
      cy.get('@popup_twitter', { timeout: 8000 }).should('be.called');
      cy.url().should(
        'contain',
        `https://twitter.com/intent/tweet?text=${encodeURI(title)}&url=${canonicalUrl}`
      );
    });

    // LinkedIn share
    it(`${page} page should have a LinkedIn share button`, () => {
      cy.visit(url);

      cy.get('[data-cy=btn-share-linkedin]').should('exist');
      cy.window().then((win) => {
        cy.stub(win, 'open')
          .callsFake((url) => {
            win.location.href = url;
          })
          .as('popup_linkedin');
      });

      cy.waitForStableDOM();

      cy.get('[data-cy=btn-share-linkedin]').first().click();
      cy.get('@popup_linkedin', { timeout: 8000 }).should('be.called');
      cy.url().should('contain', `https://www.linkedin.com/`);
    });

    // Email share
    it(`${page} page should have an Email share button`, () => {
      cy.visit(url);

      cy.get('[data-cy=btn-share-email]').should('exist');
      cy.window().then((win) => {
        cy.stub(win, 'open')
          .callsFake(() => {
            win.location.href = canonicalUrl; // Cypress don't allow to open a new window with 'mailto:'
          })
          .as('popup_email');
      });

      cy.waitForStableDOM();

      cy.get('[data-cy=btn-share-email]').first().click();
      cy.get('@popup_email', { timeout: 8000 }).should('be.called');
    });

    // Facebook share
    it(`${page} page should have a Facebook share button`, () => {
      cy.visit(url);

      cy.get('[data-cy=btn-share-facebook]').should('exist');
      cy.window().then((win) => {
        cy.stub(win, 'open')
          .callsFake((url) => {
            win.location.href = url;
          })
          .as('popup_facebook');
      });

      cy.waitForStableDOM();

      cy.get('[data-cy=btn-share-facebook]').first().click();
      cy.get('@popup_facebook', { timeout: 8000 }).should('be.called');
      cy.url().should('contain', `https://www.facebook.com/sharer/sharer.php?u=${canonicalUrl}`);
    });
  });
});
