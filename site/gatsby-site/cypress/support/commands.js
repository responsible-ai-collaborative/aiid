
Cypress.Commands.add('disableSmoothScroll', () => {
    return cy.document()
        .then(document => {
            const node = document.createElement('style');

            node.innerHTML = 'html { scroll-behavior: auto !important;}';

            document.body.appendChild(node);
        });
})