import React, { useEffect, useState } from 'react';
import { Form as FormikForm, useFormikContext } from 'formik';
import * as Yup from 'yup';
import SemanticallyRelatedIncidents from '../SemanticallyRelatedIncidents';
import RelatedIncidentsArea from '../RelatedIncidentsArea';
import { gql, useQuery } from '@apollo/client';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import TextInputGroup from 'components/forms/TextInputGroup';
import { useTranslation } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import TagsInputGroup from 'components/forms/TagsInputGroup';
import Label from 'components/forms/Label';
import UsersField from 'components/users/UsersField';
import IncidentsField from './IncidentsField';
import LinkedReportsForm from './LinkedReportsForm';
import { Spinner } from 'flowbite-react';

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

function IncidentForm({ entityNames = [], isNewIncident = false }) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormikContext();

  const { t } = useTranslation();

  const { config } = useLocalization();

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

        {values.reports && values.reports.length > 0 && (
          <LinkedReportsForm reports={values.reports} />
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

        {!isNewIncident && (
          <>
            <h4 className="mt-3">Translations</h4>

            {config
              .filter((c) => c.code !== 'en') // Exclude English since it's the default language
              .map((c) => {
                const name = `translations_${c.code}`;

                return (
                  <div className="mt-5" key={name} data-cy={`translation-${c.code}`}>
                    <h5>{c.name}</h5>

                    <div className="mt-3">
                      <div className="flex items-center">
                        <Label label={t('Title')} />
                      </div>
                      <input
                        type="text"
                        value={values[name].title}
                        data-testid={`translation-${c.code}-title`}
                        onChange={(e) => setFieldValue(`${name}.title`, e.target.value)}
                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                          errors && touched && touched[`${name}.title`] && errors[`${name}.title`]
                            ? 'border-red-600 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
                        }`}
                      />
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center">
                        <Label label={t('Description')} />
                      </div>
                      <textarea
                        value={values[name].description}
                        data-testid={`translation-${c.code}-description`}
                        onChange={(e) => setFieldValue(`${name}.description`, e.target.value)}
                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                          errors &&
                          touched &&
                          touched[`${name}.description`] &&
                          errors[`${name}.description`]
                            ? 'border-red-600 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </FormikForm>
    </div>
  );
}

export default IncidentForm;
