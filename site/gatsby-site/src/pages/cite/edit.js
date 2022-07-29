import React from 'react';
import Layout from 'components/Layout';
import IncidentReportForm, { schema } from 'components/forms/IncidentReportForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'react-bootstrap';
import {
  FIND_REPORT,
  UPDATE_REPORT,
  DELETE_REPORT,
  useUpdateLinkedReports,
} from '../../graphql/reports';
import { UPDATE_INCIDENT, FIND_INCIDENT } from '../../graphql/incidents';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { format, getUnixTime } from 'date-fns';
import { stripMarkdown } from 'utils/typography';
import { Formik } from 'formik';

function EditCitePage(props) {
  const [reportNumber] = useQueryParam('report_number', withDefault(NumberParam, 1));

  const { data: reportData, loading: loadingReport } = useQuery(FIND_REPORT, {
    variables: { query: { report_number: reportNumber } },
  });

  const [updateReport] = useMutation(UPDATE_REPORT);

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [deleteReport] = useMutation(DELETE_REPORT);

  const { data: parentIncident, loadingIncident } = useQuery(FIND_INCIDENT, {
    variables: {
      query: {
        reports_in: {
          report_number: reportNumber,
        },
      },
    },
  });

  const loading = loadingIncident || loadingReport;

  const updateLinkedReports = useUpdateLinkedReports();

  const addToast = useToastContext();

  const handleSubmit = async (values) => {
    try {
      if (typeof values.authors === 'string') {
        values.authors = values.authors.split(',').map((s) => s.trim());
      }

      if (typeof values.submitters === 'string') {
        values.submitters = values.submitters.split(',').map((s) => s.trim());
      }

      values.date_modified = format(new Date(), 'yyyy-MM-dd');

      values.epoch_date_downloaded = getUnixTime(new Date(values.date_downloaded));
      values.epoch_date_published = getUnixTime(new Date(values.date_published));
      values.epoch_date_modified = getUnixTime(new Date(values.date_modified));

      const updated = { ...values, incident_id: undefined, __typename: undefined };

      await updateReport({
        variables: {
          query: {
            report_number: reportNumber,
          },
          set: {
            ...updated,
            plain_text: await stripMarkdown(updated.text),
          },
        },
      });

      if (values.incident_id !== parentIncident.incident.incident_id) {
        await updateLinkedReports({ reportNumber, incidentIds: [values.incident_id] });
      }

      addToast({
        message: `Incident report ${reportNumber} updated successfully.`,
        severity: SEVERITY.success,
      });
    } catch (e) {
      console.error(e);
      addToast({
        message: `Error updating incident report ${reportNumber}`,
        severity: SEVERITY.danger,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReport({
        variables: {
          query: {
            report_number: reportNumber,
          },
        },
      });

      await updateIncident({
        variables: {
          query: {
            incident_id: parentIncident.incident.incident_id,
          },
          set: {
            reports: {
              link: parentIncident.incident.reports
                .filter((report) => report.report_number != reportNumber)
                .map((report) => report.report_number),
            },
          },
        },
      });

      addToast({
        message: `Incident report ${reportNumber} deleted successfully.`,
        severity: SEVERITY.success,
      });
    } catch (e) {
      console.error(e);
      addToast({
        message: `Error deleting incident report ${reportNumber}`,
        severity: SEVERITY.danger,
      });
    }
  };

  return (
    <Layout {...props} className={'w-100'}>
      <h1 className="mb-5">Editing Incident Report {reportNumber}</h1>

      {loading && (
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
      )}
      {!reportData?.report && !loading && <div>Report not found</div>}

      {!loading && reportData?.report && parentIncident?.incident && (
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{ ...reportData.report, incident_id: parentIncident.incident.incident_id }}
        >
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <IncidentReportForm />

              <Button
                className="mt-3"
                variant="primary"
                type="submit"
                disabled={!isValid || isSubmitting}
                onClick={submitForm}
              >
                Submit
              </Button>

              <Button
                className="mt-3 text-danger"
                variant="link"
                onClick={() => {
                  confirm('Sure you want to delete this report?') && handleDelete();
                }}
              >
                Delete this report
              </Button>
            </>
          )}
        </Formik>
      )}
    </Layout>
  );
}

export default EditCitePage;
