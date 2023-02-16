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
import {
  faAlignLeft,
  faBolt,
  faCalendar,
  faCode,
  faHandPointRight,
  faPencilAlt,
  faTenge,
} from '@fortawesome/free-solid-svg-icons';
import TagsInputGroup from 'components/forms/TagsInputGroup';
import { Label } from 'flowbite-react';

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
  const { values, errors, handleChange, handleSubmit, setFieldValue, touched, handleBlur } =
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
    <div className="">
      <FormikForm noValidate onSubmit={handleSubmit} data-cy={`incident-form`}>
        <FieldContainer>
          <TextInputGroup
            name="title"
            label={t('Title')}
            placeholder={t('Report title')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            icon={faTenge}
          />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="description"
            label={t('Description')}
            type="textarea"
            as="textarea"
            placeholder={t('Incident Description')}
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            rows={3}
            schema={schema}
            icon={faAlignLeft}
          />
        </FieldContainer>

        <FieldContainer>
          <TextInputGroup
            name="date"
            label={t('Date')}
            placeholder={t('Date')}
            type="date"
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            schema={schema}
            icon={faCalendar}
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="AllegedDeployerOfAISystem"
            label={t('Alleged Deployer of AI System')}
            icon={faHandPointRight}
            placeholder={t('Who employed or was responsible for the technology?')}
            className="mt-3"
            schema={schema}
            errors={errors}
            touched={touched}
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="AllegedDeveloperOfAISystem"
            label={t('Alleged developer of AI system')}
            icon={faCode}
            placeholder={t('Who created or built the technology involved in the incident?')}
            className="mt-3"
            schema={schema}
            errors={errors}
            touched={touched}
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="AllegedHarmedOrNearlyHarmedParties"
            label={t('Alleged harmed or nearly harmed parties')}
            icon={faBolt}
            placeholder={t('Who experienced negative impacts?')}
            className="mt-3"
            schema={schema}
            errors={errors}
            touched={touched}
          />
        </FieldContainer>

        <FieldContainer>
          <TagsInputGroup
            name="editors"
            label={t('Editors')}
            icon={faPencilAlt}
            placeholder={''}
            className="mt-3"
            schema={schema}
            errors={errors}
            touched={touched}
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
            <Label>Similar Incident Id</Label>
            <input
              type={'number'}
              className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                touched[name] && errors[name]
                  ? 'border-red-600 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
              }`}
              onChange={similarIdUpdate}
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
