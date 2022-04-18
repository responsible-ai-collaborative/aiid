import React, { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import IncidentReportForm from 'components/forms/IncidentReportForm';
import { NumberParam, useQueryParam } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Spinner } from 'react-bootstrap';
import {
  FIND_REPORT,
  UPDATE_REPORT,
  DELETE_REPORT,
  useUpdateLinkedReports,
} from '../../graphql/reports';
import { FIND_INCIDENT } from '../../graphql/incidents';
import { useMutation, useQuery } from '@apollo/client/react/hooks';

function stringToEpoch(dateString) {
  let someDate = new Date(dateString);

  let epoch = Math.floor(someDate.getTime() / 1000);

  return epoch;
}

function EditCitePage(props) {
  const [report, setReport] = useState();

  const [reportNumber] = useQueryParam('reportNumber', NumberParam);

  const { data: reportData } = useQuery(FIND_REPORT, {
    variables: { query: { report_number: reportNumber } },
  });

  const { data: incidentData } = useQuery(FIND_INCIDENT, {
    variables: { query: { reports_in: { report_number: reportNumber } } },
  });

  const [updateReport] = useMutation(UPDATE_REPORT);

  const [deleteReport] = useMutation(DELETE_REPORT);

  const updateLinkedReports = useUpdateLinkedReports();

  const addToast = useToastContext();

  useEffect(() => {
    if (reportData && incidentData) {
      if (reportData.report && incidentData.incident) {
        setReport({
          ...reportData.report,
          incident_date: incidentData.incident.date,
          incident_id: reportData.report.incident_id,
        });
      } else {
        setReport(null);
      }
    }
  }, [reportData, incidentData]);

  const handleSubmit = async (values) => {
    try {
      if (typeof values.authors === 'string') {
        values.authors = values.authors.split(',').map((s) => s.trim());
      }

      if (typeof values.submitters === 'string') {
        values.submitters = values.submitters.split(',').map((s) => s.trim());
      }
      values.epoch_date_downloaded = stringToEpoch(values.date_downloaded);
      const today = new Date();

      const dd = String(today.getDate()).padStart(2, '0');

      const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

      const yyyy = today.getFullYear();

      const todayStr = yyyy + '-' + mm + '-' + dd;

      values.epoch_date_modified = stringToEpoch(todayStr);
      values.date_modified = todayStr;
      values.epoch_date_published = stringToEpoch(values.date_published);

      const updated = { ...values, __typename: undefined };

      await updateReport({
        variables: {
          query: {
            report_number: reportNumber,
          },
          set: {
            ...updated,
          },
        },
      });

      if (values.incident_id !== reportData.report.incident_id) {
        await updateLinkedReports({ reportNumber, incidentIds: [values.incident_id] });
      }

      addToast({
        message: `Incident report ${reportNumber} updated successfully.`,
        severity: SEVERITY.success,
      });
    } catch (e) {
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

      addToast({
        message: `Incident report ${reportNumber} deleted successfully.`,
        severity: SEVERITY.success,
      });
    } catch (e) {
      addToast({
        message: `Error deleting incident report ${reportNumber}`,
        severity: SEVERITY.danger,
      });
    }

    setReport(null);
  };

  return (
    <Layout {...props} className={'w-100'}>
      <h1 className="mb-5">Editing Incident Report {reportNumber}</h1>

      {report === undefined && (
        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
      )}
      {report === null && <div>Report not found</div>}

      {report && (
        <IncidentReportForm
          incident={report}
          onUpdate={setReport}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  );
}

export default EditCitePage;
