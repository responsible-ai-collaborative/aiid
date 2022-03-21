import { gql } from '@apollo/client';
import path from 'path';

describe('Download Algolia Index', () => {
  const url = '/downloadIndex';

  const downloadsFolder = Cypress.config('downloadsFolder');

  it('Should return a properly constructed Algolia index', () => {
    cy.visit(url);

    cy.query({
      query: gql`
        query {
          reports(limit: 9999) {
            _id
            cloudinary_id
            date_downloaded
            date_modified
            date_published
            date_submitted
            description
            epoch_date_downloaded
            epoch_date_modified
            epoch_date_published
            epoch_date_submitted
            epoch_incident_date
            flag
            image_url
            incident_date
            incident_id
            language
            ref_number
            report_number
            source_domain
            text
            title
            url
          }
        }
      `,
    }).then(({ data: { reports } }) => {
      cy.get('[data-cy=download]').click();

      cy.readFile(path.join(downloadsFolder, 'index.json'), { timeout: 15000 }).then((index) => {
        expect(index).to.have.length(reports.length);
        expect(index.find((r) => r.report_number == 19)).to.deep.equal({
          objectID: '5d34b8c29ced494f010ed46c',
          incident_date: '2014-08-14',
          mongodb_id: '5d34b8c29ced494f010ed46c',
          description: 'Originally published on Seattle Times on June 4, 2016 at 8:00 am',
          authors: ['Fair Workweek Initiative'],
          image_url:
            'http://static1.squarespace.com/static/556496efe4b02c9d26fdf26a/5564cf12e4b0e2aacd5c90bf/575d6f189f7266835093d178/1465776979746/5f134984-0e51-11e6-9acf-68c45ca472eb-1020x655.jpg?format=1500w',
          cloudinary_id: null,
          language: 'en',
          source_domain: 'fairworkweek.org',
          text: 'Originally published on Seattle Times on June 4, 2016 at 8:00 am\nThe company took a lot of heat in 2014 when The New York Times described scheduling practices that made some employees miserable. But the coffee giant says its policies and software have changed in important ways since then.\nStarbucks says it gives employees more advance notice and makes sure of more rest between shifts than it did when a 2014 New York Times storydescribed scheduling practices that made some workers miserable.\nThe coffee company now requires U.S. store managers to post workers’ schedules 14 days in advance, up from 10 previously. Its scheduling software now prevents managers from booking employees to work shifts with less than an eight-hour break in between, Starbucks says.\nThe company says it has never used on-call scheduling and has always tried to give available hours to part-time employees who request them. It offers full benefits to employees who work 20 hours a week or more.\nThe company’s contact center, where employees call in with concerns, now has a special team to deal with scheduling issues. Fewer than 3 percent of those calls concern scheduling, said spokeswoman Jaime Riley.\nStill, implementation appears to be uneven.\nIlana Greenberg, a barista at the Starbucks drive-through on Elliott Avenue West in Seattle, says that at her store the manager is good about getting schedules out to employees two weeks in advance.\nBut she’s heard from baristas at other stores who’ve gotten their schedules only three to four days in advance, and employees who’ve worked “clopening” shifts or “doubles” — working two shifts a day at different stores.\nGreenberg, who volunteers as an organizer with the union-backed Working Washington, acknowledges that some of those instances are likely due to the workers’ own choices. But sometimes, she says, “The manager will come up to a partner [employee] and say, ‘Can you work this shift?’ and it’s clear from phrasing and tone of voice that you don’t really have the option of saying no.”\nStarbucks acknowledges that sometimes, practice doesn’t always meet company policy. “We’re not perfect,” said spokeswoman Riley. “We know there’s still work to be done.”',
          title: 'The Seattle Times: Starbucks says its scheduling practices have improved',
          url: 'http://www.fairworkweek.org/news-bedford/starbucks-schedule',
          date_downloaded: '2019-04-13',
          date_modified: '2020-06-14',
          date_published: '2016-06-04',
          epoch_date_downloaded: 1555113600,
          epoch_date_modified: 1592092800,
          epoch_date_published: 1464998400,
          epoch_incident_date: 1407974400,
          epoch_date_submitted: 1559347200,
          submitters: ['Catherine Olsson'],
          date_submitted: '2019-06-01',
          report_number: 19,
          incident_id: 10,
          ref_number: 3,
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
          ],
        });
      });
    });
  });
});
