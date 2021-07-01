import React, { useState } from 'react';
import { Form, Button, OverlayTrigger, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Link from 'components/Link';
import DBConnecting from 'components/DBConnecting';
import { FormStyles } from 'components/styles/Form';
import * as Popovers from 'components/PopOvers';

import { useUserContext } from 'contexts/userContext';

// set in form //
// * url: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.

// set in DB function //
// * source_domain: "blogs.wsj.com" # (string) The domain name hosting the report.
// * date_submitted:`2019-07-25` # (Date) Date the report was submitted to the AIID. This determines citation order.
// * ref_number: 25 # (int) The reference number scoped to the incident ID.
// * report_number: 2379 # (int) the incrementing primary key for the report. This is a global resource identifier.
// * date_modified: `2019-07-25` # (Date or null) Date the report was edited.
// * language: "en" # (string) The language identifier of the report.

// Schema for yup
const validationSchema = Yup.object().shape({
  url: Yup.string()
    .url('*Must enter URL in http://www.example.com format')
    .required('*URL required'),
});

const QuickAddForm = () => {
  const { loading, user } = useUserContext();

  const [showSuccess, setShowSuccess] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: { url: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      await user.functions.quickAdd(values);

      resetForm();
      setSubmitting(false);
      setShowSuccess(true);
    },
  });

  return (
    <FormStyles>
      {loading && <DBConnecting />}
      <Alert variant="success" show={showSuccess}>
        Report successfully added to review queue. It will appear on the{' '}
        <Link to="/apps/submitted">review queue page</Link> within an hour.
      </Alert>
      <Form onSubmit={handleSubmit} className="mx-auto p-5">
        <Form.Group controlId="formUrl">
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={Popovers.reportAddress}
          >
            <Form.Label>Report Address :</Form.Label>
          </OverlayTrigger>
          <Form.Control
            type="text"
            name="url"
            placeholder="Report URL"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.url}
            className={touched.url && errors.url ? 'has-error' : null}
          />
          {touched.url && errors.url && <div className="error-message">{errors.url}</div>}
        </Form.Group>
        <p>
          Submitted links are added to a <Link to="/apps/submitted">review queue </Link>
          to be resolved to a new or existing incident record. Incidents submitted with
          <Link to="/apps/submit"> full details </Link> are processed before URLs not posessing the
          full details.
        </p>
        <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
          Submit
        </Button>
      </Form>
    </FormStyles>
  );
};

export default QuickAddForm;
