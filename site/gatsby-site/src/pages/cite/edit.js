import React from 'react';
import Layout from '../../components/Layout';
import IncidentReportForm, { schema } from '../../components/forms/IncidentReportForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import {
  UPDATE_REPORT,
  DELETE_REPORT,
  useUpdateLinkedReports,
  FIND_REPORT_WITH_TRANSLATIONS,
} from '../../graphql/reports';
import { UPDATE_INCIDENT, FIND_INCIDENT } from '../../graphql/incidents';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { format, getUnixTime } from 'date-fns';
import { stripMarkdown } from '../../utils/typography';
import { Formik } from 'formik';
import pick from 'lodash/pick';
import { useLocalization, LocalizedLink } from 'gatsby-theme-i18n';
import { gql, useApolloClient } from '@apollo/client';
import { useTranslation, Trans } from 'react-i18next';
import RelatedIncidents from '../../components/RelatedIncidents';

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
];

const siblingsQuery = gql`
  query Siblings($query: ReportQueryInput!) {
    reports(query: $query) {
      report_number
      embedding {
        from_text_hash
        vector
      }
    }
  }
`;

const incidentEmbedding = (reports) => {
  reports = reports.filter((report) => report.embedding);
  return reports.length == 0
    ? null
    : {
        vector: reports
          .map((report) => report.embedding.vector)
          .reduce(
            (sum, vector) => vector.map((component, i) => component + sum[i]),
            Array(reports[0].embedding.vector.length).fill(0)
          )
          .map((component) => component / reports.length),

        from_reports: reports.map((report) => report.report_number),
      };
};

function EditCitePage(props) {
  const { t, i18n } = useTranslation();

  const [reportNumber] = useQueryParam('report_number', withDefault(NumberParam, 1));

  const { data: reportData, loading: loadingReport } = useQuery(FIND_REPORT_WITH_TRANSLATIONS, {
    variables: { query: { report_number: reportNumber } },
  });

  const [updateReport] = useMutation(UPDATE_REPORT);

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [updateReportTranslations] = useMutation(UPDATE_REPORT_TRANSLATION);

  const [deleteReport] = useMutation(DELETE_REPORT);

  const { data: parentIncident, loading: loadingIncident } = useQuery(FIND_INCIDENT, {
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

  const { config } = useLocalization();

  const client = useApolloClient();

  const updateSuccessToast = ({ reportNumber, incidentId }) => ({
    message: (
      <Trans i18n={i18n} reportNumber={reportNumber} incidentId={incidentId}>
        Incident report {{ reportNumber }} updated successfully.{' '}
        <LocalizedLink to={'/cite/' + incidentId}>View Incident {{ incidentId }}</LocalizedLink>.
      </Trans>
    ),
    severity: SEVERITY.success,
  });

  const updateErrorToast = ({ reportNumber }) => ({
    message: t(`Error updating incident report {{reportNumber}}.`, { reportNumber }),
    severity: SEVERITY.danger,
  });

  const deleteSuccessToast = ({ reportNumber }) => ({
    message: t(`Incident report {{reportNumber}} deleted successfully.`, { reportNumber }),
    severity: SEVERITY.success,
  });

  const deleteErrorToast = ({ reportNumber }) => ({
    message: t(`Error deleting incident report {{reportNumber}}.`, { reportNumber }),
    severity: SEVERITY.danger,
  });

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

      if (values.incident_id !== parentIncident.incident.incident_id) {
        await updateLinkedReports({ reportNumber, incidentIds: [values.incident_id] });

        // If the parent incident has changed,
        // recompute its embedding not including that of the current report.
        const exSiblingsResponse = await client.query({
          query: siblingsQuery,
          variables: {
            query: {
              report_number_in: parentIncident.incident.reports
                .map((report) => report.report_number)
                .filter((report_number) => report_number != reportNumber),
            },
          },
        });

        const exSiblings = exSiblingsResponse.data.reports;

        const embedding = incidentEmbedding(exSiblings);

        if (embedding) {
          await client.mutate({
            mutation: UPDATE_INCIDENT,
            variables: {
              query: { incident_id: parentIncident.incident.incident_id },
              set: { embedding },
            },
          });
        }
      }

      // Update the embedding of the parent incident
      // to include the current report.
      const siblingIdsResponse = await client.query({
        query: gql`
          query SiblingIds($query: IncidentQueryInput) {
            incident(query: $query) {
              reports {
                report_number
              }
            }
          }
        `,
        variables: { query: { incident_id: values.incident_id } },
      });

      const siblingIds = siblingIdsResponse.data.incident.reports
        .map((report) => report.report_number)
        .filter((report_number) => report_number != reportNumber);

      const siblingsResponse = await client.query({
        query: siblingsQuery,
        variables: { query: { report_number_in: siblingIds } },
      });

      const siblings = siblingsResponse.data.reports;

      const embedding = incidentEmbedding(siblings.concat(values));

      if (embedding) {
        await client.mutate({
          mutation: UPDATE_INCIDENT,
          variables: {
            query: { incident_id: values.incident_id },
            set: { embedding },
          },
        });
      }

      addToast(updateSuccessToast({ reportNumber, incidentId: values.incident_id }));
    } catch (e) {
      addToast(updateErrorToast({ reportNumber }));
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

      const exSiblingsResponse = await client.query({
        query: siblingsQuery,
        variables: {
          query: {
            report_number_in: parentIncident.incident.reports
              .map((report) => report.report_number)
              .filter((report_number) => report_number != reportNumber),
          },
        },
      });

      const exSiblings = exSiblingsResponse.data.reports;

      const embedding = incidentEmbedding(exSiblings);

      await client.mutate({
        mutation: UPDATE_INCIDENT,
        variables: {
          query: { incident_id: parentIncident.incident.incident_id },
          set: { embedding },
        },
      });

      addToast(deleteSuccessToast({ reportNumber }));
    } catch (e) {
      addToast(deleteErrorToast({ reportNumber }));
    }
  };

  return (
    <Layout {...props} className={'w-full boostrap'}>
      <h1 className="mb-5">Editing Incident Report {reportNumber}</h1>

      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!reportData?.report && !loading && <div>Report not found</div>}

      {!loading && reportData?.report && parentIncident?.incident && (
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{ ...reportData.report, incident_id: parentIncident.incident.incident_id }}
        >
          {({ isValid, isSubmitting, submitForm, values, setFieldValue }) => (
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
                  confirm(t('Are you sure you want to delete this report?')) && handleDelete();
                }}
              >
                Delete this report
              </Button>

              <RelatedIncidents incident={values} setFieldValue={setFieldValue} />
            </>
          )}
        </Formik>
      )}
    </Layout>
  );
}

export default EditCitePage;
