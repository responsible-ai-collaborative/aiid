import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { Form, OverlayTrigger, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useUser } from 'mongodb/useUser';

import { Layout, Link } from 'components';
import { StyledHeading } from 'components/styles/Docs';
import { CONTAINER, FORM, BUTTON } from 'components/styles/Form';
import DBConnecting from 'components/DBConnecting';
import Popover from 'components/Popover';

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

const reportAddressPopover = Popover(
  'Link to the publicly available report',
  `This address will be linked to within many incident database UIs.`
);

const QuickAddForm = ({ ...props }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const { loading, user } = useUser();

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    // When button submits form and form is in the process of submitting, submit button is disabled
    setSubmitting(true);

    await user.functions.quickAdd(values);

    resetForm();
    setSubmitting(false);
    setShowSuccess(true);
  };

  return (
    <Layout {...props}>
      <Helmet>
        <title>Quick Add New Report URL</title>
      </Helmet>
      <div className="titleWrapper">
        <StyledHeading>Quick Add New Report URL</StyledHeading>
      </div>
      <p>
        The following form will add a report link to the{' '}
        <Link to="/apps/submitted">review queue</Link> for inclusion into the AI Incident Database.
      </p>
      <CONTAINER>
        {loading && <DBConnecting />}
        <Alert variant="success" show={showSuccess}>
          Report successfully added to review queue. It will appear on the{' '}
          <Link to="/apps/submitted">review queue page</Link> within an hour.
        </Alert>
        <Formik initialValues={{ url: '' }} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <FORM onSubmit={handleSubmit} className="mx-auto">
              <Form.Group controlId="formUrl">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={reportAddressPopover}
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
              {/*Submit button that is disabled after button is clicked/form is in the process of submitting*/}
              <p>
                Submitted links are added to a <Link to="/apps/submitted">review queue </Link>
                to be resolved to a new or existing incident record. Incidents submitted with
                <Link to="/apps/submit"> full details </Link> are processed before URLs not
                posessing the full details.
              </p>
              <BUTTON variant="primary" type="submit" disabled={isSubmitting}>
                Submit
              </BUTTON>
            </FORM>
          )}
        </Formik>
      </CONTAINER>
    </Layout>
  );
};

export default QuickAddForm;
