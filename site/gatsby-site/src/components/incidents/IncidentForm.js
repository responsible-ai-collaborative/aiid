import React, { useState, useEffect } from 'react';
import { Form as FormikForm, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Form } from 'react-bootstrap';
import TagsControl from 'components/forms/TagsControl';
import SemanticallyRelatedIncidents from '../SemanticallyRelatedIncidents';
import RelatedIncidentsArea from '../RelatedIncidentsArea';
import { gql, useApolloClient } from '@apollo/client';

const relatedIncidentIdsQuery = gql`
  query ProbablyRelatedIncidentIds($query: IncidentQueryInput) {
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
  AllegedDeployerOfAISystem: Yup.array(),
  AllegedDeveloperOfAISystem: Yup.array(),
  AllegedHarmedOrNearlyHarmedParties: Yup.array(),
});

function IncidentForm() {
  const { values, errors, handleChange, handleSubmit } = useFormikContext();

  const [editorSimilarIncidentReports, setEditorSimilarIncidentReports] = useState([]);

  const [similarReportsById, setSimilarReportsById] = useState([]);

  const client = useApolloClient();

  const updateEditorSimilarIncidents = async () => {
    const dbResponse = await client.query({
      query: relatedIncidentIdsQuery,
      variables: {
        query: {
          incident_id_in: values.editor_similar_incidents.concat(
            values.editor_dissimilar_incidents
          ),
        },
      },
    });

    const reports = dbResponse.data.incidents.reduce(
      (reports, incident) =>
        reports.concat(
          incident.reports.map((report) => ({ ...report, incident_id: incident.incident_id }))
        ),
      []
    );

    setEditorSimilarIncidentReports(reports);
  };

  useEffect(() => {
    updateEditorSimilarIncidents();
  }, []);

  return (
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
          name="description"
          value={values.description}
          onChange={handleChange}
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

      <RelatedIncidentsArea
        columnKey={'editor_similar_incidents'}
        header={'Manually-selected similar and dissimilar incidents'}
        reports={editorSimilarIncidentReports}
        loading={false}
        editable={true}
        editId={false}
        error={false}
      />

      <SemanticallyRelatedIncidents incident={values} editable={true} editId={false} />

      <Form.Group className="mt-3">
        <Form.Label>Similar Incident Id</Form.Label>
        <Form.Control
          type="number"
          onChange={async (event) => {
            const incident_id = Number(event.target.value);

            const dbResponse = await client.query({
              query: relatedIncidentIdsQuery,
              variables: {
                query: {
                  incident_id_in: [incident_id],
                },
              },
            });

            setSimilarReportsById(
              dbResponse.data.incidents[0].reports.map((report) => ({ incident_id, ...report }))
            );
          }}
        />
      </Form.Group>

      <RelatedIncidentsArea
        columnKey={'byId'}
        header={'Reports'}
        reports={similarReportsById}
        loading={false}
        editable={true}
        editId={false}
        error={false}
      />
    </FormikForm>
  );
}

export default IncidentForm;
