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

const relatedIncidentIdsQuery = gql`
  query IncidentWithReports($query: IncidentQueryInput) {
    incidents(query: $query) {
      incident_id
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
  editors: Yup.string()
    .matches(/^.{3,}$/, {
      excludeEmptyString: true,
      message: 'Incident Editor must have at least 3 characters',
    })
    .matches(/^.{3,200}$/, {
      excludeEmptyString: true,
      message: "Incident Editor can't be longer than 200 characters",
    })
    .required(),
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

  const similarReportsById =
    similarReportsByIdQuery.loading ||
    similarReportsByIdQuery.error ||
    similarReportsByIdQuery.data.incidents.length == 0 ||
    selectedSimilarId == null
      ? []
      : similarReportsByIdQuery.data.incidents[0].reports.map((report) => ({
          incident_id: selectedSimilarId.current,
          ...report,
        }));

  const editorSimilarIncidentReportsQuery = useQuery(relatedIncidentIdsQuery, {
    variables: {
      query: {
        incident_id_in: (values?.editor_similar_incidents || []).concat(
          values.editor_dissimilar_incidents
        ),
      },
    },
  });

  const editorSimilarIncidentReports =
    editorSimilarIncidentReportsQuery.loading ||
    editorSimilarIncidentReportsQuery.error ||
    editorSimilarIncidentReportsQuery.data.incidents.length == 0
      ? []
      : editorSimilarIncidentReportsQuery.data.incidents.reduce(
          (reports, incident) =>
            reports.concat(
              incident.reports.map((report) => ({ ...report, incident_id: incident.incident_id }))
            ),
          []
        );

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
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="editors"
            label={t('Editors')}
            placeholder={t('Editors')}
            errors={errors}
            touched={touched}
            schema={schema}
          />
        </FieldContainer>

        <div id="similar-incidents">
          <RelatedIncidentsArea
            columnKey={'editor_similar_incidents'}
            header={'Manually-selected similar and dissimilar incidents'}
            reports={editorSimilarIncidentReports}
            loading={false}
            setFieldValue={setFieldValue}
            editId={false}
            error={false}
          />

          <SemanticallyRelatedIncidents
            incident={values}
            setFieldValue={setFieldValue}
            editId={false}
          />

          <FieldContainer>
            <TextInputGroup
              type="number"
              label={t('Similar Incident Id')}
              placeholder={t('Similar Incident Id')}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={similarIdUpdate}
              handleBlur={handleBlur}
              showPopover={false}
              data-cy="similar-id-input"
            />
          </FieldContainer>

          <RelatedIncidentsArea
            columnKey={'byId'}
            header={'Reports'}
            reports={similarReportsById}
            loading={false}
            setFieldValue={setFieldValue}
            editId={false}
            error={false}
          />
        </div>
      </FormikForm>
    </div>
  );
}

export default IncidentForm;
