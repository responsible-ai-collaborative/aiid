import React from 'react';
import { Form as FormikForm, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Form } from 'react-bootstrap';
import TagsControl from 'components/forms/TagsControl';

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

  return (
    <FormikForm noValidate onSubmit={handleSubmit} data-cy={`incident-form`}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" name="title" value={values.title} onChange={handleChange} />
        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
      </Form.Group>

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
    </FormikForm>
  );
}

export default IncidentForm;
