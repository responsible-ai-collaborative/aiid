import React, { useEffect, useRef } from 'react';
import { Form as FormikForm, useFormikContext } from 'formik';
import * as Yup from 'yup';
import SemanticallyRelatedIncidents from '../SemanticallyRelatedIncidents';
import RelatedIncidentsArea from '../RelatedIncidentsArea';
import { gql, useQuery } from '@apollo/client';
import { debounce } from 'debounce';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import TextInputGroup from 'components/forms/TextInputGroup';
import { useTranslation } from 'react-i18next';
import TagsInputGroup from 'components/forms/TagsInputGroup';
import Label from 'components/forms/Label';
import UsersField from 'components/users/UsersField';

const relatedIncidentIdsQuery = gql`
  query IncidentWithReports($query: IncidentQueryInput) {
    incidents(query: $query) {
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
  editors: Yup.array().of(Yup.string()).required(),
  editor_notes: Yup.string().nullable(),
});

function IncidentForm() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormikContext();

  const { t } = useTranslation();

  const similarReportsByIdQuery = useQuery(relatedIncidentIdsQuery, {
    variables: {
      query: {
        incident_id_in: [],
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const selectedSimilarId = useRef(null);

  const similarIdUpdate = useRef(
    debounce((event) => {
      const incident_id = Number(event.target.value);

      selectedSimilarId.current = incident_id;

      similarReportsByIdQuery.refetch({
        query: {
          incident_id_in: [incident_id],
        },
      });
    })
  ).current;

  const similarIncidentsById =
    similarReportsByIdQuery.loading ||
    similarReportsByIdQuery.error ||
    similarReportsByIdQuery.data.incidents.length == 0 ||
    selectedSimilarId == null
      ? []
      : similarReportsByIdQuery.data.incidents.map((incident) => ({
          incident_id: selectedSimilarId.current,
          ...incident,
        }));

  const editorSimilarIncidentReportsQuery = useQuery(relatedIncidentIdsQuery, {
    variables: {
      query: {
        incident_id_in: (values?.editor_similar_incidents || []).concat(
          values.editor_dissimilar_incidents
        ),
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const editorSimilarIncidents =
    editorSimilarIncidentReportsQuery.loading ||
    editorSimilarIncidentReportsQuery.error ||
    editorSimilarIncidentReportsQuery.data.incidents.length === 0
      ? []
      : editorSimilarIncidentReportsQuery.data.incidents.map((incident) => {
          return {
            ...incident,
          };
        });

  useEffect(() => {
    window.location.hash && document.querySelector(window.location.hash).scrollIntoView();
  }, []);

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

        <div id="similar-incidents">
          <Label label={t(`Manually-selected similar and dissimilar incidents`)} />
          <RelatedIncidentsArea
            columnKey={'editor_similar_incidents'}
            incidents={editorSimilarIncidents}
            loading={editorSimilarIncidentReportsQuery.loading}
            setFieldValue={setFieldValue}
            editId={false}
            error={false}
            notFoundText={'No similar/dissimilar incidents assigned to this incident.'}
          />

          <SemanticallyRelatedIncidents
            incident={values}
            setFieldValue={setFieldValue}
            editId={false}
          />

          <div className="border rounded px-2 pb-4 mt-4">
            <div className="mt-4">
              <Label
                label={t(`Search similar/dissimilar Incident Id`)}
                popover="similarIncidentSearch"
              />
              <input
                type="number"
                data-cy="similar-id-input"
                onChange={similarIdUpdate}
                className={
                  'mt-2 bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white'
                }
              />
            </div>

            <RelatedIncidentsArea
              columnKey={'byId'}
              header={similarIncidentsById.length > 0 ? 'Incidents search results' : ''}
              incidents={similarIncidentsById}
              loading={similarReportsByIdQuery.loading}
              setFieldValue={setFieldValue}
              editId={false}
              error={false}
              notFoundText={
                'No similar incidents found. Please enter an incident ID above to perform the search.'
              }
            />
          </div>
        </div>
      </FormikForm>
    </div>
  );
}

export default IncidentForm;
