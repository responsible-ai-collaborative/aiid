declare namespace Cypress {
    interface Chainable<Subject = any> {
         getWindowScroll(): Chainable<number>;
    }
}