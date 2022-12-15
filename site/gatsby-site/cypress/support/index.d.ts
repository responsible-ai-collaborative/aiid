declare namespace Cypress {
    interface Chainable<Subject = any> {
        disableSmoothScroll(): Chainable<Promise>;
        login(email: string, password: string, options: {skipSession: boolean?} = {}): Chainable<Promise>;
        conditionalIntercept(url: string, condition: (req) => Boolean, alias: string, response: unknown?, options?: Omit<RouteMatcherOptions, 'url'>)
        clickOutside(): Chainable<Promise>;
        setEditorText(value:string, index?:string): Chainable<Promise>;
        getEditorText(index?:string): Chainable<Promise>;
    }
}