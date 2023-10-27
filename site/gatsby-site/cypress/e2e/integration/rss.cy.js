import { conditionalIt } from '../../support/utils';

describe('RSS', () => {
  it('Should generate a valid RSS feed', () => {
    cy.request('/rss.xml').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/xml');

      const xml = response.body;

      const parsedXml = Cypress.$.parseXML(xml);

      const hasChannelTag = Cypress.$(parsedXml).find('channel').length > 0;

      expect(hasChannelTag).to.be.true;

      const items = Cypress.$(parsedXml).find('channel > item').slice(0, 20);

      expect(items.length).to.be.greaterThan(0);
    });
  });

  conditionalIt(!Cypress.env('isEmptyEnvironment'), 'Should generate a valid RSS feed data', () => {
    cy.request('/rss.xml').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/xml');

      const xml = response.body;

      const parsedXml = Cypress.$.parseXML(xml);

      const hasChannelTag = Cypress.$(parsedXml).find('channel').length > 0;

      expect(hasChannelTag).to.be.true;

      const items = Cypress.$(parsedXml).find('channel > item').slice(0, 20);

      expect(items.length).to.be.greaterThan(0);

      items.each((_index, item) => {
        const description = Cypress.$(item).find('description');

        const title = Cypress.$(item).find('title');

        const pubDate = Cypress.$(item).find('pubDate');

        const guid = Cypress.$(item).find('guid');

        expect(description.length).to.equal(1);
        expect(title.length).to.equal(1);
        expect(pubDate.length).to.equal(1);
        expect(guid.length).to.equal(1);
      });
    });
  });
});
