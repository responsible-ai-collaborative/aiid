import { gql } from '@apollo/client';
import { isCompleteReport } from '../../../src/utils/variants';

const isLinked = (reportNumber, incidents) => {
  for (const incident of incidents) {
    for (const linkedReport of incident.reports) {
      if (linkedReport.report_number == reportNumber) {
        return true;
      }
    }
  }

  return false;
};

describe('Integrity', () => {
  it(
    `Shouldn't have repeated report numbers`,
    { requestTimeout: 60000, defaultCommandTimeout: 60000, responseTimeout: 60000 },
    () => {
      cy.query({
        query: gql`
          query {
            reports(limit: 9999) {
              report_number
            }
          }
        `,
      }).then(({ data: { reports } }) => {
        const reportNumbers = reports.map((r) => r.report_number);

        const hash = {};

        const repeatedNumbers = [];

        for (const number of reportNumbers) {
          if (hash[number]) {
            repeatedNumbers.push(number);
          } else {
            hash[number] = true;
          }
        }

        expect(repeatedNumbers.length).to.eq(
          0,
          'Repeated report numbers' + repeatedNumbers.toString()
        );
      });
    }
  );

  it.skip(
    `is_incident_report should be true for reports assigned to incidents and vice versa`,
    { requestTimeout: 60000, defaultCommandTimeout: 60000, responseTimeout: 60000 },
    () => {
      cy.query({
        query: gql`
          query {
            incidents(limit: 9999) {
              reports {
                report_number
              }
            }
            reports(limit: 9999) {
              report_number
              is_incident_report
            }
          }
        `,
      }).then(({ data: { incidents, reports } }) => {
        const invalidReports = [];

        reports = reports.filter((r) => isCompleteReport(r));

        for (const { report_number, is_incident_report } of reports) {
          if (isLinked(report_number, incidents) !== is_incident_report) {
            invalidReports.push(report_number);
          }
        }

        expect(invalidReports.length, `Invalid reports: [${invalidReports.toString()}]`).eq(0);
      });
    }
  );

  it(
    `Classifications should be linked to one and only one incident`,
    { requestTimeout: 30000, defaultCommandTimeout: 30000, responseTimeout: 30000 },
    () => {
      cy.query({
        query: gql`
          query {
            classifications(limit: 999999) {
              incidents {
                incident_id
              }
            }
          }
        `,
      }).then(({ data: { classifications } }) => {
        expect(classifications.every((c) => c.incidents.length == 1)).to.eq(
          true,
          'Classification linked to more than one incident'
        );
      });
    }
  );

  it(
    `Classifications should only contain attributes defined in the taxonomy`,
    { requestTimeout: 30000, defaultCommandTimeout: 30000, responseTimeout: 30000 },
    () => {
      cy.query({
        query: gql`
          query {
            taxas(limit: 999999) {
              namespace
              field_list {
                short_name
              }
            }
            classifications(limit: 999999) {
              namespace
              attributes {
                short_name
              }
            }
          }
        `,
      }).then(({ data: { classifications, taxas } }) => {
        expect(
          classifications.every((c) => {
            const taxonomy = taxas.find((t) => t.namespace === c.namespace);

            return c.attributes.every((a) =>
              taxonomy.field_list.find((f) => f.short_name === a.short_name)
            );
          })
        ).to.eq(true, 'Classification attribute not defined in a taxonomy');
      });
    }
  );
});
