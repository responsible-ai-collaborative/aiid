import { maybeIt } from '../support/utils';

import updateOneIncident from '../fixtures/reports/updateOneIncident.json';

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
      cy.get(`[name=${key}]`).should('have.value', values[key]);
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
      (req) => req.body.operationName == 'UpdateIncidentReport',
      'updateIncidentReport',
      updateOneIncident
    );

    cy.contains('button', 'Submit').click();

    cy.wait('@updateIncidentReport');

    cy.get('div[class^="ToastContext"]')
      .contains('Incident report 10 updated successfully.')
      .should('exist');
  });

  maybeIt('Should delete incident report', () => {
    cy.login(Cypress.env('e2eUsername'), Cypress.env('e2ePassword'));

    cy.visit(url);

    cy.conditionalIntercept(
      '**/graphql',
      (req) => req.body.operationName == 'deleteOneIncident',
      'delete',
      {
        data: {
          deleteOneIncident: {
            __typename: 'Incident',
            _id: '5d34b8c29ced494f010ed464',
            incident_id: 1,
          },
        },
      }
    );

    cy.contains('button', 'Delete this report').click();

    cy.wait('@delete');

    cy.get('div[class^="ToastContext"]')
      .contains('Incident report 10 deleted successfully')
      .should('exist');
  });
});
