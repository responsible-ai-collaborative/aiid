import { conditionalIt } from '../../../support/utils';

describe('/api/lookupbyurl endpoint', () => {
  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Should fetch matching incidents and reports',
    async () => {
      const url1 = `https://www.today.com/parents/moms-warn-disturbing-video-found-youtube-kids-please-be-careful-t101552?random=querystring`;

      const url2 = `https://www.nj.com/mercer/2018/12/80-workers-at-amazon-warehouse-in-nj-treated-after-being-sickened-by-bear-repellant.html#incart_river_index`;

      cy.request(`/api/lookupbyurl?urls=${url1},${url2}`).then((response) => {
        expect(response.body).to.deep.eq({
          data: {
            lookupByUrl: {
              results: [
                {
                  incidents: [
                    {
                      incident_id: 1,
                      permalink: 'https://incidentdatabase.ai/cite/1',
                      title: 'Google’s YouTube Kids App Presents Inappropriate Content',
                    },
                  ],
                  reports: [
                    {
                      report_number: 3,
                      title: 'Disturbing YouTube Kids video shows Mickey Mouse with gun',
                      url: 'https://www.today.com/parents/moms-warn-disturbing-video-found-youtube-kids-please-be-careful-t101552',
                    },
                  ],
                  url: 'https://www.today.com/parents/moms-warn-disturbing-video-found-youtube-kids-please-be-careful-t101552?random=querystring',
                },
                {
                  incidents: [
                    {
                      incident_id: 2,
                      permalink: 'https://incidentdatabase.ai/cite/2',
                      title: 'Warehouse robot ruptures can of bear spray and injures workers',
                    },
                  ],
                  reports: [
                    {
                      report_number: 141,
                      title:
                        '1 critical, 54 Amazon workers treated after bear repellent discharge in N.J. warehouse',
                      url: 'https://www.nj.com/mercer/2018/12/80-workers-at-amazon-warehouse-in-nj-treated-after-being-sickened-by-bear-repellant.html#incart_river_index',
                    },
                  ],
                  url: 'https://www.nj.com/mercer/2018/12/80-workers-at-amazon-warehouse-in-nj-treated-after-being-sickened-by-bear-repellant.html',
                },
              ],
            },
          },
        });
      });
    }
  );
});
