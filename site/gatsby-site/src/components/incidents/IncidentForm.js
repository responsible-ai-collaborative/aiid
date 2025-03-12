import React, { useEffect, useState } from 'react';
import { Form as FormikForm, useFormikContext } from 'formik';
import * as Yup from 'yup';
import SemanticallyRelatedIncidents from '../SemanticallyRelatedIncidents';
import RelatedIncidentsArea from '../RelatedIncidentsArea';
import { gql, useQuery, useMutation } from '@apollo/client';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import TextInputGroup from 'components/forms/TextInputGroup';
import { useTranslation } from 'react-i18next';
import TagsInputGroup from 'components/forms/TagsInputGroup';
import Label from 'components/forms/Label';
import UsersField from 'components/users/UsersField';
import IncidentsField from './IncidentsField';
import { Spinner, Button, Badge } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faEdit, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { UPDATE_REPORT } from '../../graphql/reports';
import { Typeahead } from 'react-bootstrap-typeahead';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { isCompleteReport } from '../../utils/variants';
import { getUnixTime } from 'date-fns';

const relatedIncidentIdsQuery = gql`
  query IncidentWithReports($filter: IncidentFilterType) {
    incidents(filter: $filter) {
      incident_id
      title
      description
      reports {
        report_number
        title
        url
      }
    }
  }
`;

export const schema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  date: Yup.date().required(),
  AllegedDeployerOfAISystem: Yup.array().required(),
  AllegedDeveloperOfAISystem: Yup.array().required(),
  AllegedHarmedOrNearlyHarmedParties: Yup.array().required(),
  implicated_systems: Yup.array().required(),
  editors: Yup.array().of(Yup.string()).required(),
  editor_notes: Yup.string().nullable(),
});

function IncidentForm({ entityNames = [] }) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormikContext();

  const { t } = useTranslation();

  const similarReportsByIdQuery = useQuery(relatedIncidentIdsQuery, {
    variables: {
      filter: {
        incident_id: { IN: [] },
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const editorSimilarIncidentReportsQuery = useQuery(relatedIncidentIdsQuery, {
    variables: {
      filter: {
        incident_id: {
          IN: (values?.editor_similar_incidents || []).concat(values.editor_dissimilar_incidents),
        },
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const [editorSimilarIncidents, setEditorSimilarIncidents] = useState([]);

  const [similarIncidentsById, setSimilarIncidentsById] = useState([]);

  const addToast = useToastContext();

  const [updateReport] = useMutation(UPDATE_REPORT);

  const [editingReportTags, setEditingReportTags] = useState(null);

  const [reportTags, setReportTags] = useState({});

  const [originalTags, setOriginalTags] = useState({});

  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    if (values.reports) {
      const tags = new Set();

      values.reports.forEach((report) => {
        if (report.tags) {
          report.tags.forEach((tag) => tags.add(tag));
        }
      });

      setAllTags(Array.from(tags));

      const tagsMap = {};

      values.reports.forEach((report) => {
        tagsMap[report.report_number] = Array.isArray(report.tags) ? [...report.tags] : [];
      });
      setReportTags(tagsMap);
    }
  }, [values.reports]);

  const handleUpdateReportTags = async (reportNumber, newTags) => {
    console.log('Updating tags for report:', reportNumber, newTags);
    try {
      await updateReport({
        variables: {
          filter: {
            report_number: { EQ: reportNumber },
          },
          update: {
            set: {
              tags: newTags,
              epoch_date_modified: getUnixTime(new Date()),
            },
          },
        },
      });

      setReportTags({
        ...reportTags,
        [reportNumber]: newTags,
      });

      if (values.reports) {
        const updatedReports = values.reports.map((report) => {
          if (report.report_number === reportNumber) {
            return {
              ...report,
              tags: newTags,
            };
          }
          return report;
        });

        values.reports = updatedReports;
      }

      setEditingReportTags(null);

      addToast({
        message: t('Tags updated successfully'),
        severity: SEVERITY.success,
      });
    } catch (error) {
      addToast({
        message: t('Error updating tags: {{message}}', { message: error.message }),
        severity: SEVERITY.danger,
        error,
      });
    }
  };

  useEffect(() => {
    let similarIncidentsById = [];

    if (
      !similarReportsByIdQuery.loading &&
      !similarReportsByIdQuery.error &&
      similarReportsByIdQuery.data?.incidents?.length > 0
    ) {
      similarIncidentsById = similarReportsByIdQuery.data.incidents.map((incident) => ({
        ...incident,
      }));

      similarIncidentsById = similarIncidentsById.filter(
        (incident) =>
          !editorSimilarIncidents.some(
            (editorIncident) => editorIncident.incident_id === incident.incident_id
          )
      );
      setFieldValue('incidentSearch', []);
    }
    setSimilarIncidentsById(similarIncidentsById);
  }, [similarReportsByIdQuery.loading, similarReportsByIdQuery.data, editorSimilarIncidents]);

  useEffect(() => {
    if (
      !editorSimilarIncidentReportsQuery.loading &&
      !editorSimilarIncidentReportsQuery.error &&
      editorSimilarIncidentReportsQuery.data.incidents.length > 0
    ) {
      setEditorSimilarIncidents(
        editorSimilarIncidentReportsQuery.data.incidents.map((incident) => {
          return {
            ...incident,
          };
        })
      );
    } else if (
      !editorSimilarIncidentReportsQuery.loading &&
      editorSimilarIncidentReportsQuery.data.incidents.length === 0
    ) {
      setEditorSimilarIncidents([]);
    }
  }, [editorSimilarIncidentReportsQuery.loading, editorSimilarIncidentReportsQuery.data]);

  useEffect(() => {
    window.location.hash && document.querySelector(window.location.hash).scrollIntoView();
  }, []);

  useEffect(() => {
    if (values.incidentSearch?.length > 0) {
      similarReportsByIdQuery.refetch({
        filter: {
          incident_id: { IN: [values.incidentSearch[0]] },
        },
      });
    }
  }, [values.incidentSearch]);

  return (
    <div>
      <FormikForm noValidate onSubmit={handleSubmit} data-cy={`incident-form`}>
        <FieldContainer>
          <TextInputGroup
            name="title"
            type="title"
            label={t('Title')}
            placeholder={t('Report title')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            showPopover={false}
            data-cy="title-input"
          />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="description"
            type="textarea"
            label={t('Description')}
            placeholder={t('Description')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            showPopover={false}
            rows={4}
            data-cy="description-input"
          />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="date"
            type="date"
            label={t('Date')}
            placeholder={t('Date')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            showPopover={false}
            data-cy="date-input"
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="AllegedDeployerOfAISystem"
            label={t('Alleged Deployer of AI System')}
            placeholder={t('Alleged Deployer of AI System')}
            errors={errors}
            touched={touched}
            schema={schema}
            data-cy="alleged-deployer-of-ai-system-input"
            options={entityNames}
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="AllegedDeveloperOfAISystem"
            label={t('Alleged Developer of AI System')}
            placeholder={t('Alleged Developer of AI System')}
            errors={errors}
            touched={touched}
            schema={schema}
            data-cy="alleged-developer-of-ai-system-input"
            options={entityNames}
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="AllegedHarmedOrNearlyHarmedParties"
            label={t('Alleged Harmed or Nearly Harmed Parties')}
            placeholder={t('Alleged Harmed or Nearly Harmed Parties')}
            errors={errors}
            touched={touched}
            schema={schema}
            data-cy="alleged-harmed-or-nearly-harmed-parties-input"
            options={entityNames}
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="implicated_systems"
            label={t('Implicated Systems')}
            placeholder={t('Implicated Systems')}
            errors={errors}
            touched={touched}
            schema={schema}
            data-cy="implicated-systems-input"
            options={entityNames}
          />
        </FieldContainer>

        <FieldContainer>
          <Label popover={'editors'} label={t('Editors')} />
          <UsersField
            data-cy="editors-input"
            name="editors"
            placeHolder={t('Editors')}
            id="editors"
          />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="editor_notes"
            type="textarea"
            label={t('Editor Notes')}
            placeholder={t('Editor Notes')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            showPopover={false}
            rows={4}
            data-cy="editor-notes-input"
          />
        </FieldContainer>

        {values.reports && values.reports.length > 0 && Object.keys(reportTags).length > 0 && (
          <FieldContainer>
            <Label label={t('Linked Reports')} popover="linkedReports" />
            <div className="mt-2 space-y-4">
              {values.reports
                .filter((r) => isCompleteReport(r))
                .map((report) => {
                  return (
                    <div key={report.report_number} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-medium">
                            <a
                              href={report.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 flex items-center"
                            >
                              {report.title}
                              <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 text-sm" />
                            </a>
                          </h4>
                          <p className="text-sm text-gray-500">Report #{report.report_number}</p>
                        </div>
                        <a
                          href={`/cite/edit?report_number=${report.report_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          {t('Edit Report')}
                        </a>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center mb-2">
                          <FontAwesomeIcon
                            fixedWidth
                            icon={faTag}
                            title={t('Tags')}
                            className="mr-2"
                          />
                          <span className="font-medium">{t('Tags')}:</span>
                        </div>

                        {editingReportTags === report.report_number ? (
                          <div className="mt-2">
                            <div>
                              <Typeahead
                                key={`report-tags-typeahead-${report.report_number}`}
                                id={`report-tags-${report.report_number}`}
                                className="Typeahead"
                                allowNew
                                multiple
                                onChange={(value) => {
                                  console.log('Typeahead onChange:', value);
                                  setReportTags({
                                    ...reportTags,
                                    [report.report_number]: value.map((v) =>
                                      v.label ? v.label : v
                                    ),
                                  });
                                }}
                                options={allTags}
                                selected={reportTags[report.report_number] || []}
                                placeholder={t('Choose or add tags...')}
                              />
                            </div>
                            <div className="flex mt-2 space-x-2">
                              <Button
                                size="xs"
                                onClick={() =>
                                  handleUpdateReportTags(
                                    report.report_number,
                                    reportTags[report.report_number]
                                  )
                                }
                              >
                                {t('Save')}
                              </Button>
                              <Button
                                size="xs"
                                color="light"
                                onClick={() => {
                                  if (originalTags[report.report_number]) {
                                    setReportTags({
                                      ...reportTags,
                                      [report.report_number]: [
                                        ...originalTags[report.report_number],
                                      ],
                                    });
                                  }
                                  setEditingReportTags(null);
                                }}
                              >
                                {t('Cancel')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 mt-1 items-center">
                            {reportTags[report.report_number] &&
                            reportTags[report.report_number].length > 0 ? (
                              reportTags[report.report_number].map((tag, index) => (
                                <Badge key={index} color="info" className="text-xs">
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm italic">{t('No tags')}</span>
                            )}
                            {editingReportTags !== report.report_number && (
                              <Button
                                size="xs"
                                color="light"
                                className="ml-2"
                                onClick={() => {
                                  setOriginalTags({
                                    ...originalTags,
                                    [report.report_number]: [
                                      ...(reportTags[report.report_number] || []),
                                    ],
                                  });
                                  setEditingReportTags(report.report_number);
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                {t('Edit')}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </FieldContainer>
        )}

        <div id="similar-incidents">
          <Label
            label={t(`Manually-selected similar and dissimilar incidents`)}
            popover="similarIncidentSearch"
          />

          <div className="border rounded-lg px-2 py-4 mt-4">
            <IncidentsField
              id="incidentSearch"
              name="incidentSearch"
              multiple={false}
              placeHolder={t(`Search similar/dissimilar Incident Id`)}
            />

            {similarReportsByIdQuery.loading && <Spinner size={'sm'} className="mt-2 ml-1" />}
            {similarIncidentsById.length > 0 && (
              <RelatedIncidentsArea
                columnKey={'byId'}
                header={similarIncidentsById.length > 0 ? t('Incidents search results') : ''}
                incidents={similarIncidentsById}
                loading={similarReportsByIdQuery.loading}
                setFieldValue={setFieldValue}
                editId={false}
                error={false}
                notFoundText={
                  'No similar incidents found. Please enter an incident ID above to perform the search.'
                }
              />
            )}
          </div>
          <RelatedIncidentsArea
            header={
              editorSimilarIncidents.length > 0 ? t('Assigned similar/dissimilar incidents') : ''
            }
            columnKey={'editor_similar_incidents'}
            incidents={editorSimilarIncidents}
            loading={editorSimilarIncidentReportsQuery.loading}
            setFieldValue={setFieldValue}
            editId={false}
            error={false}
            notFoundText={
              'No similar/dissimilar incidents assigned to this incident. Use the search above to assign similar incidents.'
            }
          />

          <SemanticallyRelatedIncidents
            incident={values}
            setFieldValue={setFieldValue}
            editId={false}
          />
        </div>
      </FormikForm>
    </div>
  );
}

export default IncidentForm;
