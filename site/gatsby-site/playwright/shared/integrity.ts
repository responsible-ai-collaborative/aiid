import { test, query } from '../utils';
import { gql } from '@apollo/client';
import { isCompleteReport } from '../../src/utils/variants';
import { expect } from '@playwright/test';

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

export function testIntegrity() {

  test.describe('Integrity', () => {

    test(`Shouldn't have repeated report numbers`, async () => {
      const { data: { reports } } = await query({
        query: gql`
          query {
            reports {
              report_number
            }
          }
        `,
      });

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

      expect(repeatedNumbers.length).toBe(0);
    });

    test(`is_incident_report should be true for reports assigned to incidents and vice versa`, async () => {
      let { data: { incidents, reports } } = await query({
        query: gql`
          query {
            incidents {
              reports {
                report_number
              }
            }
            reports {
              report_number
              is_incident_report
            }
          }
        `,
      });

      const invalidReports = [];

      reports = reports.filter((r) => isCompleteReport(r));

      for (const { report_number, is_incident_report } of reports) {
        if (isLinked(report_number, incidents) !== is_incident_report) {
          invalidReports.push(report_number);
        }
      }

      expect(invalidReports.length).toBe(0);
    });

    test(`Classifications should be linked to one and only one incident`, async () => {
      const { data: { classifications } } = await query({
        query: gql`
          query {
            classifications {
              incidents {
                incident_id
              }
            }
          }
        `,
      });

      expect(classifications.every((c) => c.incidents.length == 1)).toBe(true);
    });

    test(`Classifications should only contain attributes defined in the taxonomy`, async () => {
      const { data: { classifications, taxas } } = await query({
        query: gql`
          query {
            taxas {
              namespace
              field_list {
                short_name
              }
            }
            classifications {
              namespace
              attributes {
                short_name
              }
            }
          }
        `,
      });

      expect(
        classifications.every((c) => {
          const taxonomy = taxas.find((t) => t.namespace === c.namespace);

          return c.attributes.every((a) =>
            taxonomy.field_list.find((f) => f.short_name === a.short_name)
          );
        })
      ).toBe(true);
    });

  });
}

