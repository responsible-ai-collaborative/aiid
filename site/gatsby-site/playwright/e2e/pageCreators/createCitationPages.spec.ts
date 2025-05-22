import path from 'path';
import sinon from 'sinon';
import createCitationPages from '../../../page-creators/createCitationPages';
import { CreatePagesArgs } from 'gatsby';
import { expect } from '@playwright/test';
import { getLanguages, test } from '../../utils';
import incident_links from '../../seeds/aiidprod/incident_links';

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
      allMongodbAiidprodIncidentLinks: {
        nodes: incident_links.filter(link => link.incident_id === 1), 
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

    expect(createPage.callCount).toEqual(languages.length);

    languages.forEach((language) => {
      // Assert each language has a page created
      expect(createPage.calledWithMatch({
        path: language.code === 'en' ? '/cite/1/' : `/${language.code}/cite/1/`,
        context: {
          locale: language.code,
          linkRecords: incident_links.filter(link => link.incident_id === 1),
        },
        component: sinon.match((value) => value.includes('/templates/cite.js')),
      })).toBe(true);
    });
  });
});
