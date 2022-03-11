// Meanwhile there is not reproducible environment skip tests with admin permissions

export const maybeIt = Cypress.env('e2eUsername') && Cypress.env('e2ePassword') ? it : it.skip;
