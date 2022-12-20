import createReportPages from '../../../../page-creators/createReportPages';

const response = {
  data: {
    reports: {
      nodes: [
        {
          report_number: 1,
          language: 'en',
        },
        {
          report_number: 2,
          language: 'en',
        },
        {
          report_number: 3,
          language: 'en',
        },
        {
          report_number: 4,
          language: 'es',
        },
      ],
    },
  },
};

describe('createReportPages', () => {
  it('Should parse properly', () => {
    const graphql = cy.stub().resolves(response);

    const createPage = cy.stub();

    cy.wrap(createReportPages(graphql, createPage)).then(() => {
      expect(createPage.callCount).to.eq(4);

      cy.wrap(createPage.getCall(0).args[0]).then((page) => {
        expect(page.path).contain('/reports/1');
        expect(page.context.report_number).eq(1);
        expect(page.context.language).eq('en');
        expect(page.context.translate_es).eq(true);
        expect(page.context.translate_en).eq(false);
        expect(page.context.translate_fr).eq(true);
      });

      cy.wrap(createPage.getCall(1).args[0]).then((page) => {
        expect(page.path).contain('/reports/2');
        expect(page.context.report_number).eq(2);
        expect(page.context.language).eq('en');
        expect(page.context.translate_es).eq(true);
        expect(page.context.translate_en).eq(false);
        expect(page.context.translate_fr).eq(true);
      });

      cy.wrap(createPage.getCall(2).args[0]).then((page) => {
        expect(page.path).contain('/reports/3');
        expect(page.context.report_number).eq(3);
        expect(page.context.language).eq('en');
        expect(page.context.translate_es).eq(true);
        expect(page.context.translate_en).eq(false);
        expect(page.context.translate_fr).eq(true);
      });

      cy.wrap(createPage.getCall(3).args[0]).then((page) => {
        expect(page.path).contain('/reports/4');
        expect(page.context.report_number).eq(4);
        expect(page.context.language).eq('es');
        expect(page.context.translate_es).eq(false);
        expect(page.context.translate_en).eq(true);
        expect(page.context.translate_fr).eq(true);
      });
    });
  });
});
