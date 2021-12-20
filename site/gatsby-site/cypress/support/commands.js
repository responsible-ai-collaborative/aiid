// https://on.cypress.io/custom-commands

Cypress.Commands.add('getWindowScroll', () => {
    return cy.window().its("scrollY")
})
