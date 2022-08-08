import React from 'react';
import Layout from 'components/Layout';
import IncidentReportForm, { schema } from 'components/forms/IncidentReportForm';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner } from 'react-bootstrap';
import {
  UPDATE_REPORT,
  DELETE_REPORT,
  useUpdateLinkedReports,
  FIND_REPORT_WITH_TRANSLATIONS,
} from '../../graphql/reports';
import { UPDATE_INCIDENT, FIND_INCIDENT } from '../../graphql/incidents';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { format, getUnixTime } from 'date-fns';
import { stripMarkdown } from 'utils/typography';
import { Formik } from 'formik';
import pick from 'lodash/pick';
import { useLocalization } from 'gatsby-theme-i18n';
import { gql } from '@apollo/client';
import hash from 'object-hash';

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
];

function EditCitePage(props) {
  console.log('props', props);

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

      const plain_text = await stripMarkdown(values.text);

      let embedding = { ...reportData.report.embedding, __typename: undefined };

      if (hash(plain_text) != embedding.from_text_hash) {
        const semanticallyRelatedResponse = await fetch('/api/semanticallyRelated', {
          method: 'POST',
          body: JSON.stringify({
            text: plain_text,
            includeSimilar: false,
          }),
        });

        embedding = (await semanticallyRelatedResponse.json())?.embedding;

        if (embedding) {
          const num_reports = parentIncident.incident.embedding?.from_reports?.length;

          await updateIncident({
            variables: {
              query: {
                incident_id: parentIncident.incident.incident_id,
              },
              set: {
                embedding: parentIncident.incident.embedding
                  ? {
                      from_reports: parentIncident.incident.embedding.from_reports,
                      vector: parentIncident.incident.embedding.vector.map(
                        (component, i) =>
                          component -
                          // Subtract the old embedding's contribution to the mean
                          reportData.report.embedding.vector[i] / num_reports +
                          // Add the new embedding's contribution to the mean
                          embedding.vector[i] / num_reports
                      ),
                    }
                  : {
                      from_reports: [reportData.report.report_number],
                      vector: embedding.vector,
                    },
              },
            },
          });
        }
      }

      const updated = pick(values, reportFields);

      await updateReport({
        variables: {
          query: {
            report_number: reportNumber,
          },
          set: {
            ...updated,
            plain_text,
            embedding,
            incident_id: undefined,
            __typename: undefined,
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

      {!loadingReport && reportData?.report && (
        <Formik
          validationSchema={schema}
          onSubmit={handleSubmit}
          initialValues={{
            ...reportData.report,
            incident_id: parentIncident?.incident?.incident_id || 0,
          }}
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
