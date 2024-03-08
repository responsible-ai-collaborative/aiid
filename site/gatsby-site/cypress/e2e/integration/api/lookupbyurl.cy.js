import { conditionalIt } from '../../../support/utils';

describe('/api/lookupbyurl endpoint', () => {
  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Should fetch matching incidents and reports',
    () => {
      const url1 =
        'https://www.today.com/parents/moms-warn-disturbing-video-found-youtube-kids-please-be-careful-t101552?random=querystring';

      const url2 =
        'https://www.nj.com/mercer/2018/12/80-workers-at-amazon-warehouse-in-nj-treated-after-being-sickened-by-bear-repellant.html#incart_river_index';

      const url3 = 'https://noresults.com/none';

      const query = [url1, url2, url3].map((url) => `urls[]=${encodeURIComponent(url)}`).join('&');

      const url = `/api/lookupbyurl?${query}`;

      cy.log(`GET ${url}`);

      cy.request(url).then((response) => {
        expect(response.body).to.deep.eq({
          results: [
            {
              url: 'https://www.today.com/parents/moms-warn-disturbing-video-found-youtube-kids-please-be-careful-t101552?random=querystring',
              reports: [
                {
                  report_number: 3,
                  title: 'Disturbing YouTube Kids video shows Mickey Mouse with gun',
                  url: 'https://www.today.com/parents/moms-warn-disturbing-video-found-youtube-kids-please-be-careful-t101552',
                },
              ],
              incidents: [
                {
                  incident_id: 1,
                  title: 'Google’s YouTube Kids App Presents Inappropriate Content',
                  url: 'https://incidentdatabase.ai/cite/1',
                },
              ],
            },
            {
              url: 'https://www.nj.com/mercer/2018/12/80-workers-at-amazon-warehouse-in-nj-treated-after-being-sickened-by-bear-repellant.html#incart_river_index',
              reports: [
                {
                  report_number: 141,
                  title:
                    '1 critical, 54 Amazon workers treated after bear repellent discharge in N.J. warehouse',
                  url: 'https://www.nj.com/mercer/2018/12/80-workers-at-amazon-warehouse-in-nj-treated-after-being-sickened-by-bear-repellant.html#incart_river_index',
                },
              ],
              incidents: [
                {
                  incident_id: 2,
                  title: 'Warehouse robot ruptures can of bear spray and injures workers',
                  url: 'https://incidentdatabase.ai/cite/2',
                },
              ],
            },
            {
              url: 'https://noresults.com/none',
              reports: [],
              incidents: [],
            },
          ],
        });
      });
    }
  );

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should throw 400', () => {
    const url1 = 'badurl';

    const query = [url1].map((url) => `urls[]=${encodeURIComponent(url)}`).join('&');

    const url = `/api/lookupbyurl?${query}`;

    cy.log(`GET ${url}`);

    cy.request({ url, failOnStatusCode: false }).then((response) => {
      expect(response.body).to.deep.eq({
        status: 400,
        errors: [
          {
            path: 'urls.0',
            errorCode: 'format.openapi.requestValidation',
            message: 'must match format "url"',
            location: 'query',
          },
        ],
      });
    });
  });
});
