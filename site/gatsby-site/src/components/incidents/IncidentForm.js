import React, { useEffect, useRef } from 'react';
import { Form as FormikForm, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Form } from 'react-bootstrap';
import TagsControl from 'components/forms/TagsControl';
import SemanticallyRelatedIncidents from '../SemanticallyRelatedIncidents';
import RelatedIncidentsArea from '../RelatedIncidentsArea';
import { gql, useQuery } from '@apollo/client';
import { debounce } from 'debounce';

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
  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormikContext();

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
    <div className="bootstrap">
      <FormikForm noValidate onSubmit={handleSubmit} data-cy={`incident-form`}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" name="title" value={values.title} onChange={handleChange} />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            name="description"
            value={values.description}
            onChange={handleChange}
            style={{ height: '6em' }}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" value={values.date} onChange={handleChange} />
          <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Alleged Deployer of AI System</Form.Label>
          <TagsControl name="AllegedDeployerOfAISystem" />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Alleged Developer of AI System</Form.Label>
          <TagsControl name="AllegedDeveloperOfAISystem" />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Alleged Harmed or Nearly Harmed Parties</Form.Label>
          <TagsControl name="AllegedHarmedOrNearlyHarmedParties" />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Editors</Form.Label>
          <TagsControl name="editors" />
        </Form.Group>

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

          <Form.Group className="mt-3">
            <Form.Label>Similar Incident Id</Form.Label>
            <Form.Control type="number" data-cy="similar-id-input" onChange={similarIdUpdate} />
          </Form.Group>

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
