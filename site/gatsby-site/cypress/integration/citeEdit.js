import { maybeIt } from '../support/utils';

import updateOneIncident from '../fixtures/reports/updateOneIncident.json';

import { format, getUnixTime } from 'date-fns';

describe('Edit report', () => {
  const url = '/cite/edit?reportNumber=10';

  it('Successfully loads', () => {
    cy.visit(url);

    cy.disableSmoothScroll();
  });

  maybeIt('Should load appropriate values', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    const values = {
      authors: 'Marco Acevedo',
      date_downloaded: '2019-04-13',
      date_published: '2015-07-11',
      image_url:
        'https://assets.change.org/photos/0/yb/id/eYyBIdJOMHpqcty-1600x900-noPad.jpg?1523726975',
      incident_date: '2015-05-19',
      submitters: 'Roman Yampolskiy',
      text: `Videos filled with profanity, sexually explicit material, alcohol, smoking, and drug references - this is what parents are finding on Google’s YouTube Kids app. That’s right - its kids app.  Now, parents across the country are calling on Google to remove the app until it can guarantee the total elimination of this inappropriate content.\n\nWhen my neighbors told me about the horrible adult content popping up on the Youtube Kids app, I thought there must be a mistake. Why would Google market an app as “a family-friendly place to explore” and not have proper safeguards in place? Unfortunately, it turned out to be true. And I’ve since learned of the numerous complaints filed to the Federal Trade Commission about this very problem.\n\nEven worse, Google’s response has been laughable. They tell parents to simply flag inappropriate material or set new filters. As a father of two, it makes me angry when a large company like Google doesn’t take responsibility for its kids’ products. Parents are being sold on an app built for kids 5 and under that is supposed to keep them safe from adult content. Parents like myself are joining forces to hold Google accountable.\n\nTell Google to remove the YouTube Kids app until it can live up to its marketing.\n\nThe solution is simple: only allow content pre-approved for ages 5 and under to appear on the app, and don’t allow ads clearly meant for adults. Unless it can live up to expectations, the app should be removed.\n\nParents are not the only ones outraged. The media has blasted Google’s app, calling it “the most anti-family idea ever to come out of Silicon Valley," and reporting that it “ignores basic protections for children.”\n\nWith your support, we can get Google to remove YouTube Kids until the proper protections are in place.\n\nThese are examples of videos encountered on YouTube Kids:\n\nA graphic lecture discussing hardcore pornography by Cindy Gallop:\n\nhttps://www.youtube.com/watch?v=EgtcEq7jpAk\n\nHow to make chlorine gas with household products (chemical weapon used in Syria):\n\nhttps://www.youtube.com/watch?v=DF2CXHvh8uI\n\nHow to tie a noose:\n\nhttps://www.youtube.com/watch?v=TpAA2itjI34\n\nHow to throw knives:\n\nhttps://www.youtube.com/watch?v=NGgzn1haQ-E\n\nA guy tasting battery acid:\n\nhttps://www.youtube.com/watch?v=gif-OWNjJSw\n\nHow to use a chainsaw:\n\nhttps://www.youtube.com/watch?v=Kk28thdgCEU\n\nA “Sesame Street” episode dubbed with long strings of expletives:\n\nhttps://www.youtube.com/watch?v=kVkqzE-iiEY\n\nReferences to pedophilia in a homemade video reviewing a “My Little Pony” episode:\n\nhttps://www.youtube.com/watch?v=7K9uH4d-HnU\n\nA DIY video on conducting illegal piracy, featuring pictures of marijuana leaves:\n\nhttps://www.youtube.com/watch?v=dZDF5uqORA0`,
      title: 'Remove YouTube Kids app until it eliminates its inappropriate content',
      url: 'https://www.change.org/p/remove-youtube-kids-app-until-it-eliminates-its-inappropriate-content',
    };

    Object.keys(values).forEach((key) => {
      cy.get(`[name=${key}]`, { timeout: 8000 }).should('have.value', values[key]);
    });

    cy.get('[class*=Typeahead] [option]').should('have.length', 0);
  });

  maybeIt('Should submit new values', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    const values = {
      authors: 'Test Author',
      date_downloaded: '2022-01-01',
      date_published: '2022-02-02',
      image_url: 'https://test.com/test.jpg',
      incident_date: '2022-03-03',
      submitters: 'Test Submitter',
      text: 'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease',
      title: 'Test Title',
      url: 'https://www.test.com/test',
    };

    Object.keys(values).forEach((key) => {
      cy.get(`[name=${key}]`).clear().type(values[key]);
    });

    cy.get('[class*=Typeahead] [type="text"]').type('New Tag');

    cy.get('a[aria-label="New Tag"]').click();

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'updateReport',
      updateOneIncident
    );

    cy.contains('button', 'Submit').click();

    cy.wait('@updateReport').then((xhr) => {
      const date_modified = format(new Date(), 'yyyy-MM-dd');

      const epoch_date_modified = getUnixTime(new Date(date_modified));

      expect(xhr.request.body.variables.set.authors).deep.eq(['Test Author']);
      expect(xhr.request.body.variables.set.cloudinary_id).eq('reports/test.com/test.jpg');
      expect(xhr.request.body.variables.set.date_downloaded).eq('2022-01-01');
      expect(xhr.request.body.variables.set.date_modified).eq(date_modified);
      expect(xhr.request.body.variables.set.date_published).eq('2022-02-02');
      expect(xhr.request.body.variables.set.epoch_date_downloaded).eq(1640995200);
      expect(xhr.request.body.variables.set.epoch_date_modified).eq(epoch_date_modified);
      expect(xhr.request.body.variables.set.epoch_date_published).eq(1643760000);
      expect(xhr.request.body.variables.set.flag).eq(null);
      expect(xhr.request.body.variables.set.image_url).eq('https://test.com/test.jpg');
      expect(xhr.request.body.variables.set.incident_date).eq('2022-03-03');
      expect(xhr.request.body.variables.set.incident_id).eq(1);
      expect(xhr.request.body.variables.set.report_number).eq(10);
      expect(xhr.request.body.variables.set.submitters).deep.eq(['Test Submitter']);
      expect(xhr.request.body.variables.set.tags).deep.eq(['New Tag']);
      expect(xhr.request.body.variables.set.text).eq(
        'Sit quo accusantium quia assumenda. Quod delectus similique labore optio quaease'
      );
      expect(xhr.request.body.variables.set.title).eq('Test Title');
      expect(xhr.request.body.variables.set.url).eq('https://www.test.com/test');
    });

    cy.get('div[class^="ToastContext"]')
      .contains('Incident report 10 updated successfully.')
      .should('exist');
  });

  maybeIt('Should delete incident report', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'DeleteOneReport',
      'delete',
      { data: { deleteOneReport: { __typename: 'Report', report_number: 10 } } }
    );

    cy.contains('button', 'Delete this report', { timeout: 8000 }).click();

    cy.wait('@delete');

    cy.get('div[class^="ToastContext"]')
      .contains('Incident report 10 deleted successfully')
      .should('exist');
  });

  maybeIt('Should link a report to another incident', () => {
    cy.visit(`/cite/edit?reportNumber=23`);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'UpdateReport',
      'UpdateReport',
      {
        data: {
          updateOneReport: {
            __typename: 'Report',
            authors: ['Aimee Picchi'],
            date_downloaded: '2019-04-13',
            date_published: '2015-09-24',
            flag: true,
            image_url:
              'https://cbsnews1.cbsistatic.com/hub/i/r/2015/03/17/01a38576-5108-40f7-8df8-5416164ed878/thumbnail/1200x630/ca8d35fe6bc065b5c9a747d92bc6d94c/154211248.jpg',
            incident_id: 12,
            report_number: 23,
            submitters: ['Catherine Olsson'],
            tags: ['boe'],
            text: "For Starbucks (SBUX) barista Kylei Weisse, working at the coffee chain helps him secure health insurance and some extra money while he studies at Georgia Perimeter College. What it doesn't provide is the kind of stable schedule that the company promised its workers last year.\n\"It's the wild inconsistency\" of the hours that's a problem, Weisse, 32, said. \"We're supposed to get them 10 days in advance, which often happens, but there's no guarantee. If our manager doesn't get it to us on time, we just have to deal with it.\"\nThat became a problem recently when Weisse's manager gave him only a few days notice on his work hours, which ended up conflicting with an anatomy and physiology exam at his college. Weisse ended up paying another worker $20 to take his shift so he could take the exam.\nThe short notice is especially frustrating because of Starbucks' vow last year to post employees' schedules at least 10 days in advance, as well as the company's insistence that workers provide at least one-month notice when they need to take a day off.\nWhat's behind Starbucks price increases?\nWeisse isn't alone in complaining that Starbucks isn't living up to its promises to overhaul its labor practices for its roughly 130,000 baristas. That vow followed an article last year by The New York Times that detailed how workers were struggling to manage childcare and other obligations when the company provided only a few days notice about their schedules.\nAbout half of roughly 200 Starbucks baristas in a recent survey said they are still receiving their schedule with less than one week's notice. Others also reported being asked to handle \"clopens,\" split shifts in which employees work a closing shift late into the evening and then an early opening shift the following morning. The company last year promised to end the practice.\nOf course, Starbucks isn't alone in using \"just-in-time\" scheduling, with the retail and restaurant industry increasingly turning to software that allows them to change work schedules at the last minute, depending on whether business picks up or slows down. But it is Starbucks that has become a lightning rod on the issue given its vows to improve how it treats employees and its own emphatic claims to valuing workers, whom it labels \"partners.\"\n\"Starbucks has the values and wants to do right by their employees,\" said Carrie Gleason, director of the Fair Workweek Initiative at the Center for Popular Democracy, an advocacy group focused on workers'rights, and a co-author of the group's new report on the company's labor practices. \"However, since last year when the company recognized there was a serious problem with the way it scheduled workers and pledged to reform, still so many of the same issues persist.\"\nStarbucks didn't respond to requests for comment on the study or on baristas' reports of labor practices that are failing to meet the company's stated goals.\nIn an internal memo this week published by Time, Starbucks executive Cliff Burrows wrote that the company couldn't validate the survey, but added that \"the findings suggest, contrary to the expectations we have in place, that some partners are receiving their schedules less than one week in advance and that there is a continuing issue with some partners working a close and then an opening shift the following morning.\" He asks store managers \"to go the extra mile to ensure partners have a consistent schedule.\"\nStarbucks ends \"race together\" campaign amid public backlash\nTo be sure, some Starbucks workers are receiving at least 10 days notice on their work hours, with the survey finding that about one-third receive two weeks notice and another 18 percent get their schedules three weeks in advance. But that leaves almost half of workers who only receive one week's notice, making it more difficult from them manage other obligations, such as school, family commitments or other jobs.\nClopens remain a problem, as well. About 60 percent of workers who have to handle a clopen receive seven or fewer hours of rest between a closing and an opening shift, the study found.\nThat's prompted one former Starbucks employee to start a petition to end the practice of scheduling clopens. Ciara Moran noted in her petition that she sometimes was only able to get four or five hours of sleep on the days she was scheduled for clopens. She said she quit her job because she doubted whether it was possible to get ahead given the demands on workers.\nEven if Starbucks stuck with its policy of providing eight hours between shifts, that's not enough time, especially given that many workers in the service sector have long commutes, the study said.\nAnother issue singled out by the report is Starbucks' practices on sick time. Since paid time off is only available to workers with at least a year on the job, about 40 percent of employees in the survey said they had dealt with barriers in taking sick days.\nIn a perfect world, Weisse said he'd like to receive his schedule either a month or a",
            title: '​Is Starbucks shortchanging its baristas?',
            url: 'https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas/',
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'RelatedIncidents',
      'RelatedIncidents',
      {
        data: {
          incidentsToLink: [
            {
              __typename: 'Incident',
              incident_id: 12,
              reports: [{ __typename: 'Report', report_number: 42 }],
            },
          ],
          incidentsToUnlink: [
            {
              __typename: 'Incident',
              incident_id: 10,
              reports: [
                { __typename: 'Report', report_number: 16 },
                { __typename: 'Report', report_number: 17 },
                { __typename: 'Report', report_number: 18 },
                { __typename: 'Report', report_number: 19 },
                { __typename: 'Report', report_number: 20 },
                { __typename: 'Report', report_number: 21 },
                { __typename: 'Report', report_number: 22 },
                { __typename: 'Report', report_number: 23 },
                { __typename: 'Report', report_number: 24 },
                { __typename: 'Report', report_number: 25 },
              ],
            },
          ],
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpdateIncident' && req.body.variables.query.incident_id === 10,
      'UpdateIncident10',
      {
        data: {
          updateOneIncident: {
            __typename: 'Incident',
            incident_id: 10,
            reports: [
              { __typename: 'Report', report_number: 16 },
              { __typename: 'Report', report_number: 17 },
              { __typename: 'Report', report_number: 18 },
              { __typename: 'Report', report_number: 19 },
              { __typename: 'Report', report_number: 20 },
              { __typename: 'Report', report_number: 21 },
              { __typename: 'Report', report_number: 22 },
              { __typename: 'Report', report_number: 24 },
              { __typename: 'Report', report_number: 25 },
            ],
          },
        },
      }
    );

    cy.conditionalIntercept(
      '**/graphql',
      (req) =>
        req.body.operationName == 'UpdateIncident' && req.body.variables.query.incident_id === 12,
      'UpdateIncident12',
      {
        data: {
          updateOneIncident: {
            __typename: 'Incident',
            incident_id: 12,
            reports: [
              { __typename: 'Report', report_number: 23 },
              { __typename: 'Report', report_number: 42 },
            ],
          },
        },
      }
    );

    cy.get('form[data-cy="report"]').should('be.visible');

    cy.get('[name="incident_id"]').clear().type('12');

    cy.contains('button', 'Submit').click();

    cy.wait('@UpdateReport')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query.report_number).to.equal(23);
        expect(variables.set.incident_id).to.equal(12);
      });

    cy.wait('@RelatedIncidents')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.incidentIds).to.deep.equal([12]);
        expect(variables.reports).to.deep.equal([{ report_number: 23 }]);
      });

    cy.wait('@UpdateIncident10')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query).to.deep.equal({ incident_id: 10 });
        expect(variables.set).to.deep.equal({
          reports: { link: [16, 17, 18, 19, 20, 21, 22, 24, 25] },
        });
      });

    cy.wait('@UpdateIncident12')
      .its('request.body.variables')
      .then((variables) => {
        expect(variables.query).to.deep.equal({ incident_id: 12 });
        expect(variables.set).to.deep.equal({ reports: { link: [42, 23] } });
      });
  });
});
