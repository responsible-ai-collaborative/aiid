import discoverIndexGenerator from '../../src/utils/discoverIndexGenerator';
import allClassifications from '../fixtures/classifications/allClassifications.json';

describe('Generate a Algolia index', () => {
  it('Should return a properly constructed Algolia index', () => {
    cy.wrap(discoverIndexGenerator({ graphql: () => allClassifications })).then((index) => {
      expect(index).to.have.length(10);

      const report = index[0];

      expect(report.objectID).to.eq('5d34b8c29ced494f010ed469');
      expect(report.incident_date).to.eq('2014-08-14');
      expect(report.mongodb_id).to.eq('5d34b8c29ced494f010ed469');
      expect(report.description).to.eq(
        'Increasing numbers of low-income mothers and fathers are at the center of a new collision that pits workplace scheduling technology against the routines of parenting.'
      );
      expect(report.authors).to.deep.eq(['Jodi Kantor']);
      expect(report.image_url).to.eq(
        'https://static01.nyt.com/images/2014/08/13/us/worker-hours-1407960684740/worker-hours-1407960684740-articleLarge.jpg'
      );
      expect(report.cloudinary_id).to.eq(null);
      expect(report.language).to.eq('en');
      expect(report.source_domain).to.eq('nytimes.com');
      expect(report.text).to.eq(
        'SAN DIEGO — In a typical last-minute scramble.\nAnother line with Markdown'
      );
      expect(report.title).to.eq('Working Anything but 9 to 5');
      expect(report.url).to.eq(
        'https://www.nytimes.com/interactive/2014/08/13/us/starbucks-workers-scheduling-hours.html'
      );
      expect(report.date_downloaded).to.eq('2019-04-13');
      expect(report.date_modified).to.eq('2020-06-14');
      expect(report.date_published).to.eq('2014-08-14');
      expect(report.epoch_date_downloaded).to.eq(1555113600);
      expect(report.epoch_date_modified).to.eq(1592092800);
      expect(report.epoch_date_published).to.eq(1407974400);
      expect(report.epoch_incident_date).to.eq(1407974400);
      expect(report.epoch_date_submitted).to.eq(1559347200);
      expect(report.submitters).to.deep.eq(['Catherine Olsson']);
      expect(report.date_submitted).to.eq('2019-06-01');
      expect(report.report_number).to.eq(16);
      expect(report.incident_id).to.eq(10);
      expect(report.ref_number).to.eq(0);

      expect(report.classifications).to.deep.eq([
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
      ]);
    });
  });
});
