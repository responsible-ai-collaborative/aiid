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
          language: 'es',
        },
      ],
    },
  },
};

const languages = [
  {
    code: 'en',
    hrefLang: 'en-US',
    name: 'English',
    localName: 'English',
    langDir: 'ltr',
    dateFormat: 'MM/DD/YYYY',
  },
  {
    code: 'es',
    hrefLang: 'es',
    name: 'Spanish',
    localName: 'Español',
    langDir: 'ltr',
    dateFormat: 'DD-MM-YYYY',
  },
  {
    code: 'fr',
    hrefLang: 'fr',
    name: 'French',
    localName: 'Français',
    langDir: 'ltr',
    dateFormat: 'DD-MM-YYYY',
  },
];

describe('createReportPages', () => {
  it('Should parse properly', () => {
    const graphql = cy.stub().resolves(response);

    const createPage = cy.stub();

    cy.wrap(createReportPages(graphql, createPage, { languages })).then(() => {
      expect(createPage.callCount).to.eq(6);

      cy.wrap(createPage.getCall(0).args[0]).then((page) => {
        expect(page.path).contain('/reports/1');
        expect(page.context.originalPath).eq('/reports/1');
        expect(page.context.locale).eq('en');
        expect(page.context.hrefLang).eq('en-US');
        expect(page.context.report_number).eq(1);
        expect(page.context.language).eq('en');
        expect(page.context.translate_es).eq(true);
        expect(page.context.translate_en).eq(false);
        expect(page.context.translate_fr).eq(true);
      });

      cy.wrap(createPage.getCall(1).args[0]).then((page) => {
        expect(page.path).contain('/reports/2');
        expect(page.context.originalPath).eq('/reports/2');
        expect(page.context.locale).eq('en');
        expect(page.context.hrefLang).eq('en-US');
        expect(page.context.report_number).eq(2);
        expect(page.context.language).eq('es');
        expect(page.context.translate_es).eq(false);
        expect(page.context.translate_en).eq(true);
        expect(page.context.translate_fr).eq(true);
      });

      cy.wrap(createPage.getCall(2).args[0]).then((page) => {
        expect(page.path).contain('/es/reports/1');
        expect(page.context.originalPath).eq('/es/reports/1');
        expect(page.context.locale).eq('es');
        expect(page.context.hrefLang).eq('es');
        expect(page.context.report_number).eq(1);
        expect(page.context.language).eq('en');
        expect(page.context.translate_es).eq(true);
        expect(page.context.translate_en).eq(false);
        expect(page.context.translate_fr).eq(true);
      });

      cy.wrap(createPage.getCall(3).args[0]).then((page) => {
        expect(page.path).contain('/es/reports/2');
        expect(page.context.originalPath).eq('/es/reports/2');
        expect(page.context.locale).eq('es');
        expect(page.context.hrefLang).eq('es');
        expect(page.context.report_number).eq(2);
        expect(page.context.language).eq('es');
        expect(page.context.translate_es).eq(false);
        expect(page.context.translate_en).eq(true);
        expect(page.context.translate_fr).eq(true);
      });

      cy.wrap(createPage.getCall(4).args[0]).then((page) => {
        expect(page.path).contain('/fr/reports/1');
        expect(page.context.originalPath).eq('/fr/reports/1');
        expect(page.context.locale).eq('fr');
        expect(page.context.hrefLang).eq('fr');
        expect(page.context.report_number).eq(1);
        expect(page.context.language).eq('en');
        expect(page.context.translate_es).eq(true);
        expect(page.context.translate_en).eq(false);
        expect(page.context.translate_fr).eq(true);
      });

      cy.wrap(createPage.getCall(5).args[0]).then((page) => {
        expect(page.path).contain('/fr/reports/2');
        expect(page.context.originalPath).eq('/fr/reports/2');
        expect(page.context.locale).eq('fr');
        expect(page.context.hrefLang).eq('fr');
        expect(page.context.report_number).eq(2);
        expect(page.context.language).eq('es');
        expect(page.context.translate_es).eq(false);
        expect(page.context.translate_en).eq(true);
        expect(page.context.translate_fr).eq(true);
      });
    });
  });
});
