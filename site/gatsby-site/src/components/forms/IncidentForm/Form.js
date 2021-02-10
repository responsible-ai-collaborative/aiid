import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { CSVReader } from 'react-papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Link from 'components/Link';
import Label from 'components/Label';
import DBConnecting from 'components/DBConnecting';
import { FormStyles, StyledForm } from 'components/styles/Form';
import RelatedIncidents from './RelatedIncidents';
import * as PopOvers from './PopOvers';
import { dateRegExp } from 'utils/date';

import { useUser } from 'mongodb/useUser';
import { useMongo } from 'mongodb/useMongo';
import Loader from 'components/Loader';

// set in form //
// * title: "title of the report" # (string) The title of the report that is indexed.
// * text: "Long text for the report" # (string) This is the complete text for the report in the MongoDB instance, and a shortened subset in the Algolia index
// * incident_date: `2019-07-25` # (Date) Date the incident occurred. Defaults to the article date.
// * date_downloaded:`2019-07-25` # (Date) Date the report was downloaded.
// * submitters: Array(string) # People that submitted the incident report
// * authors: Array(string) # People that wrote the incident report
// * date_published: `2019-07-25` # (Date or null) The publication date of the report.
// * image_url: "http://si.wsj.net/public/resources/images/BN-IM269_YouTub_P_2015051817" # (string) The URL for the image that is indexed. This will be stored on the server as a hash of the URL.
// * url: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.

// set in DB function //
// * source_domain: "blogs.wsj.com" # (string) The domain name hosting the report.
// * incident_id: 1 # (int) The incrementing primary key for incidents, which are a collection of reports.
// * date_submitted:`2019-07-25` # (Date) Date the report was submitted to the AIID. This determines citation order.
// * ref_number: 25 # (int) The reference number scoped to the incident ID.
// * report_number: 2379 # (int) the incrementing primary key for the report. This is a global resource identifier.
// * date_modified: `2019-07-25` # (Date or null) Date the report was edited.
// * language: "en" # (string) The language identifier of the report.

// Schema for yup
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(6, '*Title must have at least 6 characters')
    .max(500, "*Titles can't be longer than 500 characters")
    .required('*Title is required'),
  authors: Yup.string()
    .min(3, '*Authors must have at least 3 characters')
    .max(200, "*Authors can't be longer than 200 characters")
    .required('*Author is required. Anonymous or the publication can be entered.'),
  submitters: Yup.string()
    .min(3, '*Submitter must have at least 3 characters')
    .max(200, "*Submitter list can't be longer than 200 characters")
    .required('*Submitter is required. Anonymous can be entered.'),
  text: Yup.string()
    .min(80, '*Text must have at least 80 characters')
    .max(50000, "*Text can't be longer than 50000 characters")
    .required('*Text is required'),
  incident_date: Yup.string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .required('*Incident date required'),
  date_published: Yup.string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .required('*Date published is required'),
  date_downloaded: Yup.string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .required('*Date downloaded required'),
  url: Yup.string()
    .url('*Must enter URL in http://www.example.com format')
    .required('*URL required'),
  image_url: Yup.string().matches(
    /((https?):\/\/)(\S)*$/,
    '*Must enter URL in http://www.example.com/images/preview.png format'
  ),
  incident_id: Yup.number().integer('*Must be an incident number or empty'),
});

const defaultValue = {
  title: '',
  authors: '',
  submitters: 'Anonymous',
  incident_date: '',
  date_published: '',
  date_downloaded: '',
  url: '',
  image_url: '',
  incident_id: '',
  text: '',
};

const TextInputGroup = ({
  name,
  label,
  placeholder,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  ...props
}) => (
  <Form.Group>
    <Label popover={PopOvers[name]} label={label} />
    <Form.Control
      type="text"
      name={name}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values[name]}
      className={touched[name] && errors[name] ? 'has-error' : null}
      {...props}
    />
    {touched[name] && errors[name] ? <div className="error-message">{errors[name]}</div> : null}
  </Form.Group>
);

const IncidentForm = ({ incident }) => {
  const { loading, user, isAdmin } = useUser();
  const { runQuery, updateOne } = useMongo();

  const [csvData, setCsvData] = useState([{ data: incident || defaultValue }]);
  const [csvIndex, setCsvIndex] = useState(0);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setSubmitting,
    resetForm,
  } = useFormik({
    initialValues: incident || defaultValue,
    validationSchema,
    onSubmit,
  });

  const previousRecord = () => {
    const newCSVIndex = Math.max(0, csvIndex - 1);
    setCsvIndex(newCSVIndex);
  };

  const nextRecord = () => {
    const newCSVIndex = Math.min(csvData.length - 1, csvIndex + 1);
    setCsvIndex(newCSVIndex);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);

    if (incident) {
      // Update reported incident
      updateOne({ incident_id: parseInt(values.id) }, values);
    } else {
      // Submit new incident into queue
      await user.functions.createReportForReview(values);
    }

    resetForm();
    setSubmitting(false);
  };

  const TextInputGroupProps = { values, errors, touched, handleChange, handleBlur };

  useEffect(() => {
    setValues(csvData[csvIndex].data);
  }, [csvIndex]);

  useEffect(() => {
    setValues(csvData[csvIndex].data);
  }, [csvData]);

  return (
    <FormStyles className="mb-4">
      {loading && <DBConnecting />}
      <StyledForm onSubmit={handleSubmit} className="mx-auto">
        <TextInputGroup
          name="title"
          label="Title :"
          placeholder="Report title"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="authors"
          label="Author CSV :"
          placeholder="Author CSV"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="submitters"
          label="Submitter CSV :"
          placeholder="Submitter CSV"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="incident_date"
          label="Incident Date :"
          placeholder="YYYY-MM-DD"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="date_published"
          label="Date Published :"
          placeholder="YYYY-MM-DD"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="date_downloaded"
          label="Date Downloaded :"
          placeholder="YYYY-MM-DD"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="url"
          label="Report Address :"
          placeholder="Report URL"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="image_url"
          label="Image Address :"
          placeholder="Image URL"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="incident_id"
          label="Incident ID :"
          placeholder="OPTIONAL"
          {...TextInputGroupProps}
        />
        <TextInputGroup
          name="text"
          label="Text :"
          placeholder="Text of the report"
          as="textarea"
          {...TextInputGroupProps}
        />
        <p>
          Submitted reports are added to a <Link to="/apps/submitted">review queue </Link>
          to be resolved to a new or existing incident record. Incidents are reviewed and merged
          into the database after enough incidents are pending.
        </p>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {incident ? 'Update' : 'Submit'}
        </Button>
        <RelatedIncidents incident={values} />
      </StyledForm>
      <Container className={isAdmin ? 'd-block' : 'd-none'}>
        <h2>Advanced: Add by CSV</h2>
        <p>
          The header row of the file is assumed to match the names of the inputs in the form. Each
          row will be processed, one at a time, so that it flows through the form validations before
          submitting.
        </p>
        <p>
          Record {csvIndex + 1} of {csvData.length}
        </p>
        <CSVReader
          onDrop={setCsvData}
          onError={console.log}
          config={{ header: true }}
          noDrag
          addRemoveButton
        >
          <span>Click to upload.</span>
        </CSVReader>
        <Container className="text-center py-3">
          <Button className="mr-2" onClick={previousRecord}>
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </Button>
          <Button onClick={nextRecord}>
            Next <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </Container>
      </Container>
    </FormStyles>
  );
};

export default IncidentForm;
