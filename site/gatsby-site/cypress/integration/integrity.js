import { gql } from '@apollo/client';

describe('Integrity', () => {
  it('Should have repeated report numbers', () => {
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
  });

  it(`Shouldn't be any orphan reports`, () => {
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
          }
        }
      `,
    }).then(({ data: { incidents, reports } }) => {
      const isLinked = (reportNumber) => {
        for (const incident of incidents) {
          for (const linkedReport of incident.reports) {
            if (linkedReport.report_number == reportNumber) {
              return true;
            }
          }
        }

        return false;
      };

      const orphanReports = [];

      for (const reportNumber of reports.map((r) => r.report_number)) {
        if (!isLinked(reportNumber)) {
          orphanReports.push(reportNumber);
        }
      }

      expect(orphanReports.length, `Orphan reports: [${orphanReports.toString()}]`).eq(0);
    });
  });
});
