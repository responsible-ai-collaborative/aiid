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
    { requestTimeout: 30000, defaultCommandTimeout: 30000, responseTimeout: 30000 },
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

  it(
    `is_incident_report should be true for reports assigned to incidents and vice versa`,
    { requestTimeout: 30000, defaultCommandTimeout: 30000, responseTimeout: 30000 },
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
});
