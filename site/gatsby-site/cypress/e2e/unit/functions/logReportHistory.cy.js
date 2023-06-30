const logReportHistory = require('../../../../../realm/functions/logReportHistory');

const reportsSchema = require('../../../../../realm/data_sources/mongodb-atlas/aiidprod/reports/schema.json');

const historyReportsSchema = require('../../../../../realm/data_sources/mongodb-atlas/history/reports/schema.json');

const report = {
  report_number: 3152,
  is_incident_report: true,
  title: '​Is Starbucks shortchanging its baristas? v5',
  date_downloaded: '2023-06-09',
  date_modified: '2023-06-14',
  date_published: '2023-06-09',
  date_submitted: '2023-06-09',
  epoch_date_downloaded: 1686268800,
  epoch_date_modified: 1686765044,
  epoch_date_published: 1686268800,
  epoch_date_submitted: 1686268800,
  image_url:
    'https://assets3.cbsnewsstatic.com/hub/i/r/2015/03/17/01a38576-5108-40f7-8df8-5416164ed878/thumbnail/1200x630/ca8d35fe6bc065b5c9a747d92bc6d94c/154211248.jpg',
  cloudinary_id:
    'reports/assets3.cbsnewsstatic.com/hub/i/r/2015/03/17/01a38576-5108-40f7-8df8-5416164ed878/thumbnail/1200x630/ca8d35fe6bc065b5c9a747d92bc6d94c/154211248.jpg',
  authors: ['Pablo Costa'],
  submitters: ['Test User'],
  text: '[](/moneywatch)\n\nBy Aimee Picchi\n\nSeptember 24, 2015 / 11: 41 AM / MoneyWatch\n\nFor Starbucks([SBUX](http://markets.cbsnews.com/SBUX/quote/)) barista Kylei Weisse',
  plain_text:
    '\n\nBy Aimee Picchi\n\nSeptember 24, 2015 / 11: 41 AM / MoneyWatch\n\nFor Starbucks(SBUX) barista Kylei Weisse',
  url: 'https://www.cbsnews.com/news/is-starbucks-shortchanging-its-baristas',
  source_domain: 'cbsnews.com',
  language: 'en',
  tags: [],
  user: { link: '63320ce63ec803072c9f529c' },
  modifiedBy: '63320ce63ec803072c9f529c',
  editor_notes: 'this is an editor note',
};

describe('Functions', () => {
  it('Should log a new report', () => {
    const reportsHistoryCollection = {
      insertOne: cy.stub().resolves(),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: cy.stub().returns({
            collection: (() => {
              const stub = cy.stub();

              stub.withArgs('reports').returns(reportsHistoryCollection);

              return stub;
            })(),
          }),
        }),
      },
    };

    cy.wrap(logReportHistory(report)).then(() => {
      expect(reportsHistoryCollection.insertOne.firstCall.args[0]).to.deep.equal(report);
    });
  });

  it('Reports schema should be the same as History Reports schema', () => {
    expect(historyReportsSchema.properties).to.deep.equal({
      ...reportsSchema.properties,
      modifiedBy: {
        bsonType: 'string',
      },
    });
    expect(historyReportsSchema.required).to.deep.equal(reportsSchema.required);
  });
});
