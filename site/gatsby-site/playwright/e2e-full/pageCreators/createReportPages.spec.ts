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
          { report_number: 3, language: 'es' },
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

    await createReportPages(graphql as unknown as CreatePagesArgs['graphql'], createPage, {
      languages,
    });

    // Verify total pages created
    expect(createPage.callCount).toEqual(languages.length * response.data.reports.nodes.length);

    languages.forEach((language, languageIndex) => {
      
      response.data.reports.nodes.forEach((report, reportIndex) => {
        const callIndex = languageIndex * response.data.reports.nodes.length + reportIndex;
        const page = createPage.getCall(callIndex).args[0];

        const reportPath = language.code === 'en' ? `/reports/${report.report_number}/` : `/${language.code}/reports/${report.report_number}/`;
        expect(page.path).toBe(reportPath);
        expect(page.context.originalPath).toBe(reportPath);
        expect(page.context.locale).toBe(language.code);
        expect(page.context.hrefLang).toBe(language.hrefLang);
        expect(page.context.report_number).toBe(report.report_number);
        expect(page.context.language).toBe(report.language);
      });
    });
  });
});
