import React from 'react';
import Layout from '../../components/Layout';
import IncidentReportForm, { schema } from '../../components/forms/IncidentReportForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Spinner, Button } from 'flowbite-react';
import {
  UPDATE_REPORT,
  DELETE_REPORT,
  FIND_REPORT_WITH_TRANSLATIONS,
  LINK_REPORTS_TO_INCIDENTS,
} from '../../graphql/reports';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { format, getUnixTime } from 'date-fns';
import { stripMarkdown } from '../../utils/typography';
import { Formik } from 'formik';
import pick from 'lodash/pick';
import { useLocalization, LocalizedLink } from 'gatsby-theme-i18n';
import { gql } from '@apollo/client';
import { useTranslation, Trans } from 'react-i18next';
import RelatedIncidents from '../../components/RelatedIncidents';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { Link } from 'gatsby';
import { isEqual } from 'lodash';

const UPDATE_REPORT_TRANSLATION = gql`
  mutation UpdateReportTranslation($input: UpdateOneReportTranslationInput) {
    updateOneReportTranslation(input: $input) {
      report_number
    }
  }
`;

const reportFields = [
  'authors',
  'cloudinary_id',
  'date_downloaded',
  'date_modified',
  'date_published',
  'editor_notes',
  'epoch_date_downloaded',
  'epoch_date_modified',
  'epoch_date_published',
  'flag',
  'image_url',
  'language',
  'plain_text',
  'report_number',
  'source_domain',
  'submitters',
  'tags',
  'text',
  'title',
  'url',
  'embedding',
  'text_inputs',
  'text_outputs',
];

function EditCitePage(props) {
  const { t, i18n } = useTranslation();

  const [reportNumber] = useQueryParam('report_number', withDefault(NumberParam, 1));

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, 1));

  const {
    data: reportData,
    loading: loadingReport,
    refetch: refetchReport,
  } = useQuery(FIND_REPORT_WITH_TRANSLATIONS, {
    variables: { query: { report_number: reportNumber } },
  });

  const [updateReport] = useMutation(UPDATE_REPORT);

  const [updateReportTranslations] = useMutation(UPDATE_REPORT_TRANSLATION);

  const [deleteReport] = useMutation(DELETE_REPORT);

  const {
    data: incidentsData,
    loading: loadingIncident,
    refetch: refetchIncidents,
  } = useQuery(FIND_INCIDENTS, {
    variables: {
      query: {
        reports_in: {
          report_number: reportNumber,
        },
      },
    },
  });

  const incident_ids = incidentsData?.incidents.map((incident) => incident.incident_id);

  const loading = loadingIncident || loadingReport;

  const [linkReportsToIncidents] = useMutation(LINK_REPORTS_TO_INCIDENTS);

  const addToast = useToastContext();

  const { config } = useLocalization();

  const updateSuccessToast = ({ reportNumber, incidentId }) => ({
    message: (
      <Trans i18n={i18n} reportNumber={reportNumber} incidentId={incidentId}>
        Incident report {{ reportNumber }} updated successfully.{' '}
        <LocalizedLink to={'/cite/' + incidentId}>View Incident {{ incidentId }}</LocalizedLink>.
      </Trans>
    ),
    severity: SEVERITY.success,
  });

  const updateIssueSuccessToast = ({ reportNumber }) => ({
    message: (
      <Trans i18n={i18n} reportNumber={reportNumber}>
        Issue {{ reportNumber }} updated successfully.{' '}
        <LocalizedLink to={'/reports/' + reportNumber}>View Issue {{ reportNumber }}</LocalizedLink>
        .
      </Trans>
    ),
    severity: SEVERITY.success,
  });

  const updateErrorToast = ({ reportNumber, error }) => ({
    message: t(`Error updating incident report {{reportNumber}}.`, { reportNumber }),
    severity: SEVERITY.danger,
    error,
  });

  const deleteSuccessToast = ({ reportNumber }) => ({
    message: t(`Incident report {{reportNumber}} deleted successfully.`, { reportNumber }),
    severity: SEVERITY.success,
  });

  const deleteErrorToast = ({ reportNumber, error }) => ({
    message: t(`Error deleting incident report {{reportNumber}}.`, { reportNumber }),
    severity: SEVERITY.danger,
    error,
  });

  const handleSubmit = async (values) => {
    try {
      if (
        values.incident_ids.length == 0 &&
        incident_ids.length > 0 &&
        !confirm(
          t('Removing all incidents transforms the report to an issue report, are you sure?')
        )
      ) {
        return;
      }

      if (
        values.incident_ids.length > 0 &&
        incident_ids.length == 0 &&
        !confirm(
          t(
            'You are converting the report from an issue report to an incident report, are you sure?'
          )
        )
      ) {
        return;
      }

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

      const updated = pick(values, reportFields);

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

      for (const { code } of config.filter((c) => c.code !== values.language)) {
        const updatedTranslation = pick(values[`translations_${code}`], ['title', 'text']);

        await updateReportTranslations({
          variables: {
            input: {
              ...updatedTranslation,
              language: code,
              report_number: reportNumber,
              plain_text: await stripMarkdown(updatedTranslation.text),
            },
          },
        });
      }

      if (!isEqual(values.incident_ids, incident_ids)) {
        await linkReportsToIncidents({
          variables: {
            input: {
              incident_ids: values.incident_ids,
              report_numbers: [reportNumber],
            },
          },
        });

        await refetchReport();

        await refetchIncidents();
      }

      if (values.incident_ids.length > 0) {
        addToast(updateSuccessToast({ reportNumber, incidentId: values.incident_ids[0] }));
      } else {
        addToast(updateIssueSuccessToast({ reportNumber }));
      }
    } catch (error) {
      addToast(updateErrorToast({ reportNumber, error }));
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

      await linkReportsToIncidents({
        variables: {
          input: {
            incident_ids: [],
            report_numbers: [reportNumber],
          },
        },
      });

      addToast(deleteSuccessToast({ reportNumber }));
    } catch (error) {
      addToast(deleteErrorToast({ reportNumber, error }));
    }
  };

  return (
    <Layout {...props} className={'w-full p-1'}>
      {!loading && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="mb-5">
            <Trans>Editing Incident Report {{ reportNumber }}</Trans>
          </h1>
          <Link to={`/cite/${incidentId}#r${reportNumber}`} className="mb-5">
            <Button outline={true} color={'light'}>
              <Trans>Back to Report {{ reportNumber }}</Trans>
            </Button>
          </Link>
        </div>
      )}

      {loading && (
        <div className="flex">
          <DefaultSkeleton />
        </div>
      )}

      {!loading && (
        <>
          {!reportData?.report ? (
            <div>Report not found</div>
          ) : (
            <>
              <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                  ...reportData.report,
                  incident_ids,
                }}
              >
                {({ isValid, isSubmitting, submitForm, values, setFieldValue }) => (
                  <>
                    <IncidentReportForm />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={!isValid || isSubmitting}
                          onClick={submitForm}
                          className="mr-4 disabled:opacity-50 flex"
                        >
                          {isSubmitting ? (
                            <>
                              <Spinner size="sm" />
                              <div className="ml-2">
                                <Trans>Updating...</Trans>
                              </div>
                            </>
                          ) : (
                            <Trans>Submit</Trans>
                          )}
                        </Button>
                        {!isValid && (
                          <div className="text-danger">
                            <Trans ns="validation">
                              Please review report. Some data is missing.
                            </Trans>
                          </div>
                        )}
                      </div>
                      <Button
                        className="text-danger"
                        variant="link"
                        disabled={isSubmitting}
                        onClick={() => {
                          confirm(t('Are you sure you want to delete this report?')) &&
                            handleDelete();
                        }}
                      >
                        Delete this report
                      </Button>
                    </div>

                    {reportData.report.is_incident_report && (
                      <RelatedIncidents incident={values} setFieldValue={setFieldValue} />
                    )}
                  </>
                )}
              </Formik>
            </>
          )}
        </>
      )}
    </Layout>
  );
}

export default EditCitePage;
