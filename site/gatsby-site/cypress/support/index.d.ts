declare namespace Cypress {
    interface Chainable<Subject = any> {
        disableSmoothScroll(): Chainable<Promise>;
    }
}