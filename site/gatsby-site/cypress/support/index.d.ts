declare namespace Cypress {
    interface Chainable<Subject = any> {
        disableSmoothScroll(): Chainable<Promise>;
        login(email: string, password: string): Chainable<Promise>;
    }
}