import React, { Component } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { Form, Button, OverlayTrigger, Popover, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import API from '../../src/mongodb/api';

import Layout from 'components/Layout';
import Link from 'components/Link';
import { StyledHeading } from 'components/styles/Docs';

// Reference:
// https://hackernoon.com/building-react-forms-with-formik-yup-and-react-bootstrap-with-a-minimal-amount-of-pain-and-suffering-1sfk3xv8

const CONTAINER = styled.div`
  background: #f7f9fa;
  height: auto;
  width: 100%;
  min-width: 450px;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  @media (min-width: 786px) {
  }
  label {
    color: #24b9b6;
    font-size: 1.2em;
    font-weight: 400;
  }
  .error {
    border: 2px solid #ff6565;
  }
  .error-message {
    color: #ff6565;
    padding: 0.5em 0.2em;
    height: 1em;
    position: absolute;
    font-size: 0.8em;
  }
  h1 {
    color: #24b9b6;
    padding-top: 0.5em;
  }
  .form-group {
    margin-bottom: 2.5em;
  }
`;

const MYFORM = styled(Form)`
  width: 90%;
  text-align: left;
  padding-top: 2em;
  padding-bottom: 2em;
  @media (min-width: 786px) {
  }
`;

const BUTTON = styled(Button)`
  background: #1863ab;
  border: none;
  font-size: 1.2em;
  font-weight: 400;
  &:hover {
    background: #1d3461;
  }
`;

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

const popover = (title, text) => (
  <Popover id="popover-basic">
    <Popover.Title as="h3">{title}</Popover.Title>
    <Popover.Content>{text}</Popover.Content>
  </Popover>
);

const reportAddressPopover = popover(
  'Link to the publicly available report',
  `This address will be linked to within many incident database UIs.`
);

export default class QuickAddForm extends Component {
  constructor() {
    super();
    this.state = { newIncidentData: {}, showSuccess: false };
  }

  render() {
    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Quick Add New Report URL</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>Quick Add New Report URL</StyledHeading>
        </div>
        <p>
          The following form will add a report link to the{' '}
          <Link to="/apps/submitted">review queue</Link> for inclusion into the AI Incident
          Database.
        </p>
        <CONTAINER>
          <API
            newIncidentData={this.state.newIncidentData}
            createCallback={this.state.createCallback}
          />
          <Alert variant="success" show={this.state.showSuccess}>
            Report successfully added to review queue. It will appear on the{' '}
            <Link to="/apps/submitted">review queue page</Link> within an hour.
          </Alert>
          <Formik
            initialValues={{ url: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // When button submits form and form is in the process of submitting, submit button is disabled
              setSubmitting(true);
              let that = this;

              function createCallback() {
                resetForm();
                setSubmitting(false);
                that.setState({ showSuccess: true });
              }
              this.setState({ newIncidentData: values, createCallback: createCallback });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <MYFORM onSubmit={handleSubmit} className="mx-auto">
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
                  {touched.url && errors.url ? (
                    <div className="error-message">{errors.url}</div>
                  ) : null}
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
              </MYFORM>
            )}
          </Formik>
        </CONTAINER>
      </Layout>
    );
  }
}
