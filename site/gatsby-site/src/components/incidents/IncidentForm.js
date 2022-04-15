import React from 'react';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import TagsControl from 'components/forms/TagsControl';

const schema = Yup.object().shape({
  date: Yup.date().required(),
  description: Yup.string().required(),
  AllegedDeployerOfAISystem: Yup.array(),
  AllegedDeveloperOfAISystem: Yup.array(),
  AllegedHarmedOrNearlyHarmedParties: Yup.array(),
});

function IncidentForm({ incident, onSubmit }) {
  return (
    <Formik validationSchema={schema} onSubmit={onSubmit} initialValues={incident}>
      {({ handleSubmit, handleChange, values, isValid, errors }) => (
        <FormikForm noValidate onSubmit={handleSubmit}>
          <Form.Group>
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

          <Button className="mt-3" type="submit" disabled={!isValid}>
            Save
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
}

export default IncidentForm;
