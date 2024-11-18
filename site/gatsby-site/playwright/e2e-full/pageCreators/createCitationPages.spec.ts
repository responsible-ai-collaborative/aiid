import path from 'path';
import sinon from 'sinon';
import createCitationPages from '../../../page-creators/createCitationPages';
import { CreatePagesArgs } from 'gatsby';
import { expect } from '@playwright/test';
import { getLanguages, test } from '../../utils';

test.describe('createCitationPages', () => {
  let graphql: sinon.SinonStub;
  let createPage: sinon.SinonSpy;
  const response = {
    data: {
      allMongodbAiidprodIncidents: {
        nodes: [
          {
            incident_id: 1,
            title: 'Google’s YouTube Kids App Presents Inappropriate Content',
            date: '2015-05-19',
            reports: [
              {
                title: 'Google’s YouTube Kids App Criticized for ‘Inappropriate Content’',
                report_number: 1,
                language: 'en',
                image_url:
                  'http://si.wsj.net/public/resources/images/BN-IM269_YouTub_P_20150518174822.jpg',
                cloudinary_id:
                  'reports/si.wsj.net/public/resources/images/BN-IM269_YouTub_P_20150518174822.jpg',
              },
              {
                title: 'YouTube Kids app is STILL showing disturbing videos',
                report_number: 2,
                language: 'en',
                image_url:
                  'https://i.dailymail.co.uk/i/pix/2018/02/06/15/48EEE02F00000578-0-image-a-18_1517931140185.jpg',
                cloudinary_id:
                  'reports/i.dailymail.co.uk/i/pix/2018/02/06/15/48EEE02F00000578-0-image-a-18_1517931140185.jpg',
              },
            ],
            editor_similar_incidents: [],
            editor_dissimilar_incidents: [],
            flagged_dissimilar_incidents: [],
            description:
              'YouTube’s content filtering and recommendation algorithms exposed children to disturbing and inappropriate videos.',
            nlp_similar_incidents: [
              {
                incident_id: 55,
                similarity: 0.9990941882133484,
              },
              {
                incident_id: 15,
                similarity: 0.9989638924598694,
              },
              {
                incident_id: 34,
                similarity: 0.998900830745697,
              },
            ],
          },
        ],
      },
    },
    extensions: {},
  };

  const languages = getLanguages();

  test.beforeEach(() => {
    graphql = sinon.stub();
    createPage = sinon.spy();
  });

  test.afterEach(() => {
    sinon.restore();
  });

  test('Should create cite pages for each available language', async () => {
    graphql.resolves(response);

    await createCitationPages(graphql as unknown as CreatePagesArgs['graphql'], createPage, { languages });

    expect(createPage.callCount).toEqual(4);

    // Assert for English page
    expect(createPage.calledWithMatch({
      path: '/cite/1/',
      context: {
        locale: 'en',
        translate_es: true,
        translate_en: false,
        translate_fr: true,
        translate_ja: true,
      },
      component: sinon.match((value) => value.includes('/templates/cite.js')),
    })).toBe(true);

    // Assert for Spanish page
    expect(createPage.calledWithMatch({
      path: '/es/cite/1/',
      context: {
        locale: 'es',
        translate_es: true,
        translate_en: false,
        translate_fr: true,
        translate_ja: true,
      },
    })).toBe(true);

    // Assert for French page
    expect(createPage.calledWithMatch({
      path: '/fr/cite/1/',
      context: {
        locale: 'fr',
        translate_es: true,
        translate_en: false,
        translate_fr: true,
        translate_ja: true,
      },
    })).toBe(true);

    // Assert for Japanese page
    expect(createPage.calledWithMatch({
      path: '/ja/cite/1/',
      context: {
        locale: 'ja',
        translate_es: true,
        translate_en: false,
        translate_fr: true,
        translate_ja: true,
      },
    })).toBe(true);
  });
});
