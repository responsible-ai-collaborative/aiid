import React from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Link from 'components/Link';
import DBConnecting from 'components/DBConnecting';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

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

const QuickAddForm = ({ className = '' }) => {
  const { loading, user } = useUserContext();

  const addToast = useToastContext();

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: { url: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      user.functions
        .quickAdd(values)
        .then(() => {
          addToast({
            message: (
              <>
                {'Report successfully added to review queue. It will appear on the  '}
                <Link to="/apps/submitted">review queue page</Link> within an hour.
              </>
            ),
            severity: SEVERITY.success,
          });
        })
        .catch(() => {
          addToast({
            message: 'Was not able to create the report, please review the form and try again.',
            severity: SEVERITY.warning,
          });
        });

      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <>
      <Form onSubmit={handleSubmit} className={className}>
        {loading && <DBConnecting />}
        <Row>
          <Form.Group as={Col} controlId="formUrl">
            <Form.Control
              type="text"
              name="url"
              placeholder="Report URL"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.url}
              isInvalid={!!errors.url}
            />
            <Form.Control.Feedback type="invalid">{errors.url}</Form.Control.Feedback>
          </Form.Group>

          <Col xs="auto">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || loading || !!errors.url}
            >
              Submit
            </Button>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Form.Text className="text-muted">
              Submitted links are added to a <Link to="/apps/submitted">review queue </Link>
              to be resolved to a new or existing incident record. Incidents submitted with
              <Link to="/apps/submit"> full details </Link> are processed before URLs not possessing
              the full details.
            </Form.Text>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default QuickAddForm;
