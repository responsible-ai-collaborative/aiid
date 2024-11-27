import sinon from 'sinon';
import createReportPages from '../../../page-creators/createReportPages';
import { CreatePagesArgs } from 'gatsby';
import { expect } from '@playwright/test';
import { getLanguages, test } from '../../utils';

test.describe('createReportPages', () => {
  let graphql: sinon.SinonStub;
  let createPage: sinon.SinonSpy;

  const response = {
    data: {
      reports: {
        nodes: [
          { report_number: 1, language: 'en' },
          { report_number: 2, language: 'es' },
        ],
      },
    },
  };

  const languages = getLanguages();

  test.beforeEach(() => {
    graphql = sinon.stub();
    createPage = sinon.spy();
  });

  test.afterEach(() => {
    sinon.restore();
  });

  test('Should parse properly', async () => {
    graphql.resolves(response);

    await createReportPages(graphql as unknown as CreatePagesArgs['graphql'], createPage, { languages });

    // Verify total pages created
    expect(createPage.callCount).toEqual(8);

    // Validate the first page
    const page1 = createPage.getCall(0).args[0];
    expect(page1.path).toContain('/reports/1/');
    expect(page1.context.originalPath).toBe('/reports/1/');
    expect(page1.context.locale).toBe('en');
    expect(page1.context.hrefLang).toBe('en-US');
    expect(page1.context.report_number).toBe(1);
    expect(page1.context.language).toBe('en');
    expect(page1.context.translate_es).toBe(true);
    expect(page1.context.translate_en).toBe(false);
    expect(page1.context.translate_fr).toBe(true);

    // Validate the second page
    const page2 = createPage.getCall(1).args[0];
    expect(page2.path).toContain('/reports/2/');
    expect(page2.context.originalPath).toBe('/reports/2/');
    expect(page2.context.locale).toBe('en');
    expect(page2.context.hrefLang).toBe('en-US');
    expect(page2.context.report_number).toBe(2);
    expect(page2.context.language).toBe('es');
    expect(page2.context.translate_es).toBe(false);
    expect(page2.context.translate_en).toBe(true);
    expect(page2.context.translate_fr).toBe(true);

    // Validate the third page
    const page3 = createPage.getCall(2).args[0];
    expect(page3.path).toContain('/es/reports/1/');
    expect(page3.context.originalPath).toBe('/es/reports/1/');
    expect(page3.context.locale).toBe('es');
    expect(page3.context.hrefLang).toBe('es');
    expect(page3.context.report_number).toBe(1);
    expect(page3.context.language).toBe('en');
    expect(page3.context.translate_es).toBe(true);
    expect(page3.context.translate_en).toBe(false);
    expect(page3.context.translate_fr).toBe(true);

    // Validate the fourth page
    const page4 = createPage.getCall(3).args[0];
    expect(page4.path).toContain('/es/reports/2/');
    expect(page4.context.originalPath).toBe('/es/reports/2/');
    expect(page4.context.locale).toBe('es');
    expect(page4.context.hrefLang).toBe('es');
    expect(page4.context.report_number).toBe(2);
    expect(page4.context.language).toBe('es');
    expect(page4.context.translate_es).toBe(false);
    expect(page4.context.translate_en).toBe(true);
    expect(page4.context.translate_fr).toBe(true);

    // Validate the fifth page
    const page5 = createPage.getCall(4).args[0];
    expect(page5.path).toContain('/fr/reports/1/');
    expect(page5.context.originalPath).toBe('/fr/reports/1/');
    expect(page5.context.locale).toBe('fr');
    expect(page5.context.hrefLang).toBe('fr');
    expect(page5.context.report_number).toBe(1);
    expect(page5.context.language).toBe('en');
    expect(page5.context.translate_es).toBe(true);
    expect(page5.context.translate_en).toBe(false);
    expect(page5.context.translate_fr).toBe(true);

    // Validate the sixth page
    const page6 = createPage.getCall(5).args[0];
    expect(page6.path).toContain('/fr/reports/2/');
    expect(page6.context.originalPath).toBe('/fr/reports/2/');
    expect(page6.context.locale).toBe('fr');
    expect(page6.context.hrefLang).toBe('fr');
    expect(page6.context.report_number).toBe(2);
    expect(page6.context.language).toBe('es');
    expect(page6.context.translate_es).toBe(false);
    expect(page6.context.translate_en).toBe(true);
    expect(page6.context.translate_fr).toBe(true);
  });
});
