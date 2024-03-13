import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import { FIND_ENTITIES } from '../../graphql/entities';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Spinner, Modal, Button } from 'flowbite-react';
import { Formik } from 'formik';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useTranslation, Trans } from 'react-i18next';
import { getUnixTime } from 'date-fns';
// import { useUserContext } from 'contexts/userContext';
// import { useLogIncidentHistory } from '../../hooks/useLogIncidentHistory';
import { FIND_REPORT_WITH_TRANSLATIONS, UPDATE_REPORT } from '../../graphql/reports';
import IncidentReportForm, { schema } from 'components/forms/IncidentReportForm';

export default function ReportEditModal({ show, onClose, report_number }) {
  // const { user } = useUserContext();

  const { t, i18n } = useTranslation();

  const [report, setReport] = useState(null);

  const { data: reportData } = useQuery(FIND_REPORT_WITH_TRANSLATIONS, {
    variables: { query: { report_number: report_number } },
  });

  const {
    data: incidentsData,
    // loading: loadingIncident,
    // refetch: refetchIncidents,
  } = useQuery(FIND_INCIDENTS, {
    variables: {
      query: {
        reports_in: {
          report_number: report_number,
        },
      },
    },
  });

  const incident_ids = incidentsData?.incidents.map((incident) => incident.incident_id);

  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [UpdateReport] = useMutation(UPDATE_REPORT);

  // const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const addToast = useToastContext();

  // const { logIncidentHistory } = useLogIncidentHistory();

  useEffect(() => {
    if (reportData?.report) {
      setReport({ ...reportData.report });
    } else {
      setReport(undefined);
    }
  }, [reportData]);

  const updateSuccessToast = ({ report_number }) => ({
    message: (
      <Trans i18n={i18n} report_number={report_number}>
        Incident {{ report_number }} updated successfully.{' '}
        <LocalizedLink to={'/reports/' + report_number}>
          View report {{ report_number }}
        </LocalizedLink>
        .
      </Trans>
    ),
    severity: SEVERITY.success,
  });

  const updateErrorToast = ({ report_number, error }) => ({
    message: t('Error updating report {{report}}. \n {{message}}', {
      report_number,
      message: error.message,
    }),
    severity: SEVERITY.danger,
    error,
  });

  const handleSubmit = async (values) => {
    try {
      const updated = {
        ...values,
        __typename: undefined,
      };

      updated.epoch_date_modified = getUnixTime(new Date());

      await UpdateReport({
        variables: {
          query: {
            report_number: report_number,
          },
          set: {
            ...updated,
          },
        },
      });

      addToast(updateSuccessToast({ report_number }));

      onClose();
    } catch (error) {
      addToast(updateErrorToast({ report_number, error }));
    }
  };

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} onClose={onClose} className="submission-modal" size="3xl">
      <Modal.Header>Edit Report {report?.report_number}</Modal.Header>

      {!report && (
        <Modal.Body>
          {report === undefined && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
          {report === null && <div>Report not found</div>}
        </Modal.Body>
      )}

      {report && entitiesData?.entities && (
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            ...report,
            incident_ids,
          }}
        >
          {({ isValid, isSubmitting, submitForm }) => (
            <>
              <Modal.Body>
                <IncidentReportForm />
              </Modal.Body>
              <Modal.Footer>
                <Button color="gray" onClick={onClose}>
                  Close
                </Button>
                <Button
                  onClick={submitForm}
                  disabled={isSubmitting || !isValid}
                  className="flex gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      <Trans>Updating</Trans>
                    </>
                  ) : (
                    <Trans>Update</Trans>
                  )}
                </Button>
              </Modal.Footer>
            </>
          )}
        </Formik>
      )}
    </Modal>
  );
}
