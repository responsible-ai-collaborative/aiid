import discoverIndexGenerator from '../../src/utils/discoverIndexGenerator';
import allClassifications from '../fixtures/classifications/allClassifications.json';

describe('Generate a Algolia index', () => {
  it('Should return a properly constructed Algolia index', () => {
    cy.wrap(discoverIndexGenerator({ graphql: () => allClassifications })).then((index) => {
      expect(index).to.have.length(6);
      expect(index[0]).to.deep.eq({
        objectID: '5d34b8c29ced494f010ed469',
        incident_date: '2014-08-14',
        mongodb_id: '5d34b8c29ced494f010ed469',
        description:
          'Increasing numbers of low-income mothers and fathers are at the center of a new collision that pits workplace scheduling technology against the routines of parenting.',
        authors: ['Jodi Kantor'],
        image_url:
          'https://static01.nyt.com/images/2014/08/13/us/worker-hours-1407960684740/worker-hours-1407960684740-articleLarge.jpg',
        cloudinary_id: null,
        language: 'en',
        source_domain: 'nytimes.com',
        text: 'SAN DIEGO — In a typical last-minute scramble.\n\nAnother line with Markdown',
        title: 'Working Anything but 9 to 5',
        url: 'https://www.nytimes.com/interactive/2014/08/13/us/starbucks-workers-scheduling-hours.html',
        date_downloaded: '2019-04-13',
        date_modified: '2020-06-14',
        date_published: '2014-08-14',
        epoch_date_downloaded: 1555113600,
        epoch_date_modified: 1592092800,
        epoch_date_published: 1407974400,
        epoch_incident_date: 1407974400,
        epoch_date_submitted: 1559347200,
        submitters: ['Catherine Olsson'],
        date_submitted: '2019-06-01',
        report_number: 16,
        incident_id: 10,
        ref_number: 0,
        classifications: [
          'CSET:Intent:Unclear',
          'CSET:Lives Lost:false',
          'CSET:Location:Global',
          'CSET:Named Entities:Starbucks',
          'CSET:Named Entities:Kronos',
          'CSET:Near Miss:Unclear/unknown',
          'CSET:Severity:Negligible',
          'CSET:Harm Type:Psychological harm',
          'CSET:Infrastructure Sectors:Food and agriculture',
          'CSET:Public Sector Deployment:false',
          'CSET:Sector of Deployment:',
          'CSET:Technology Purveyor:Starbucks',
          'resources:Datasheets for Datasets:false',
          'resources:MSFT AI Fairness Checklist:true',
        ],
      });
    });
  });
});
