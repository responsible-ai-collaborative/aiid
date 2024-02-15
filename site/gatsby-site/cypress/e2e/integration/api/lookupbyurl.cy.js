import { conditionalIt } from '../../../support/utils';

describe('/api/lookupbyurl endpoint', () => {
  conditionalIt(
    !Cypress.env('isEmptyEnvironment'),
    'Should fetch matching incidents and reports',
    async () => {
      const url = `https://www.today.com/parents/moms-warn-disturbing-video-found-youtube-kids-please-be-careful-t101552?random=querystring`;

      cy.request(`/api/lookupbyurl?urls=${url}`).then((response) => {
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
              ],
            },
          },
        });
      });
    }
  );
});
