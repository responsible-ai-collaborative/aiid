import React, { useEffect, useState } from 'react';
import { Form, Button, OverlayTrigger, ListGroup, Container } from 'react-bootstrap';
import { CSVReader } from 'react-papaparse';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Link } from 'components';
import { CONTAINER, FORM, BUTTON } from 'components/styles/Form';
import DBConnecting from 'components/DBConnecting';
import Popover from 'components/Popover';
import { dateRegExp } from 'utils/date';

import config from '../../../config';

import { useUser } from 'mongodb/useUser';
import { useMongo } from 'mongodb/useMongo';

// These tooltip messages are displayed on the form elements explaining what is expected to be input.
const titlePopover = Popover(
  'Headline',
  `Most works have a title that should be entered here verbatim.
  In the event the work has no title, attempt to summarize the contents in a few words without editorializing.
  This text is featured prominently in incident records.`
);

const authorsPopover = Popover(
  'Creator of the Linked Content',
  `Enter the names of the creators of the linked content.
  You should enter all persons contributing to the written work as a single
  row of a CSV.`
);

const submittersPopover = Popover(
  'This is you!',
  `Enter your name here. If more than one person contributed to collecting the incident,
  you can enter multiple people separated with commas. Alternatively, you can enter
  "Anonymous" as submitter if you do not want to be attributed in the database.
  Entries in this field will be added to the public leaderboard.`
);

const incidentDatePopover = Popover(
  'When did the incident first occur?',
  `Many AI incidents are not discrete events (i.e., they happen over a period of time).
  Further, it is often difficult to know when the incident first occured when the first
  public report follows some period of time after the first occurence. In this field
  you should enter either the date of the first report of the incident, or
  an educated guess of when the incident likely first occured. For instance, if
  the incident is pertaining to a search engine feature that launched in January
  and the first public incident report is in February, you should assign an
  incident date in January.`
);

const datePublishedPopover = Popover(
  'When did the report become available?',
  `Reports often have a publication date at the URL, but even when it does not,
  you can visit the <a href="https://archive.org/web/">Wayback Machine</a>
  to find when the report URL was first indexed.`
);

const dateDownloadedPopover = Popover(
  'When did you copy the contents of the report into this form?',
  `Reports are often updated through time by news organizations. This
  date helps determine whether the contents could potentially be stale. Typically
  you will put today's date here.`
);

const reportAddressPopover = Popover(
  'Link to the publicly available report',
  `This address will be linked to within many incident database UIs.`
);

const imageAddressPopover = Popover(
  'An image used to preview the incident report',
  `This should be a URL for an image that will be indexed and displayed next to the report.
  Most publications now have headline images you can grab a URL from by right-clicking.
  You can also link figure images here instead.`
);

const incidentIDPopover = Popover(
  'Is this an existing incident?',
  `Very often reports are written about incidents that are already in the incident database.
  Before submitting, you should check whether the incident is in the database already by
  visiting the "Discover" application and searching for incidents of a similar nature
  to the incident report you are now submitting. If an incident exists for your report, but
  the report has never been submitted, please enter the corresponding incident identifier
  number here. If the incident report already exists,
  please do not resubmit.`
);

const textPopover = Popover(
  'Text of the article or transcript of the rich media',
  `Copy, paste, and validate the textual contents of the incident report
  match the contents of the URL linked above. Please scrub it of all advertisements
  and other media that should not be indexed and searched when users are discovering
  incidents in the database.`
);

const RelatedLayout = ({ related }) => {
  if (related.length < 1) {
    return <></>;
  }
  return (
    <>
      <p />
      <ListGroup>
        <ListGroup.Item key={'header'}>
          The following incident reports exist for the incident you are reporting on
        </ListGroup.Item>
        {related.map((val) => (
          <ListGroup.Item key={val['url']}>
            <a href={val['url']} target="_blank" rel="noreferrer">
              {val['title']}
            </a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

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

const IncidentForm = ({ incident }) => {
  const { loading, user } = useUser();

  const { runQuery, updateOne } = useMongo();

  const [csvData, setCsvData] = useState([{ data: incident || defaultValue }]);

  const [csvIndex, setCsvIndex] = useState(0);

  const [relatedIncidents, setRelatedIncidents] = useState([]);

  const isAdmin = !loading && user.type === 'token';

  const handleOnDrop = (data) => {
    console.log('---------------------------');
    console.log(data);
    setCsvData(data);
    console.log('---------------------------');
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err, file, inputElem, reason);
  };

  const updateRelated = (incident_id) => {
    const parsed = parseInt(incident_id);

    console.log(incident_id);
    if (isNaN(parsed)) {
      setRelatedIncidents([]);
      return;
    }

    runQuery(
      { incident_id: parsed },
      setRelatedIncidents,
      config['realm']['production_db']['db_service'],
      config['realm']['production_db']['db_name'],
      config['realm']['production_db']['db_collection']
    );
  };

  const previousRecord = (setValues) => {
    const newCSVIndex = Math.max(0, csvIndex - 1);

    setValues(csvData[newCSVIndex]['data']);
    setCsvIndex(newCSVIndex);
  };

  const nextRecord = (setValues) => {
    const newCSVIndex = Math.min(csvData.length - 1, csvIndex + 1);

    setValues(csvData[newCSVIndex]['data']);
    setCsvIndex(newCSVIndex);
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    // When button submits form and form is in the process of submitting, submit button is disabled
    setSubmitting(true);

    if (incident) {
      // Do update
      updateOne({ incident_id: parseInt(values.id) }, values);
      // await user.functions.updateReportInReview(values)
    } else {
      await user.functions.createReportForReview(values);
    }

    resetForm();
    setSubmitting(false);
  };

  useEffect(() => {
    updateRelated(csvData[csvIndex]['data']['incident_id']);
  }, [csvIndex]);

  let initialValues = csvData[csvIndex]['data'];

  return (
    <CONTAINER>
      {loading && <DBConnecting />}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setValues,
        }) => (
          <>
            <FORM onSubmit={handleSubmit} className="mx-auto">
              <Form.Group controlId="formTitle">
                <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={titlePopover}>
                  <Form.Label>Title :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Report title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  className={touched.title && errors.title ? 'has-error' : null}
                />
                {touched.title && errors.title ? (
                  <div className="error-message">{errors.title}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formAuthors">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={authorsPopover}
                >
                  <Form.Label>Author CSV :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="authors"
                  placeholder="Author CSV"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.authors}
                  className={touched.authors && errors.authors ? 'has-error' : null}
                />
                {touched.authors && errors.authors ? (
                  <div className="error-message">{errors.authors}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formSubmitters">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={submittersPopover}
                >
                  <Form.Label>Submitter CSV :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="submitters"
                  placeholder="Author CSV"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.submitters}
                  className={touched.submitters && errors.submitters ? 'has-error' : null}
                />
                {touched.submitters && errors.submitters ? (
                  <div className="error-message">{errors.submitters}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formIncidentDate">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={incidentDatePopover}
                >
                  <Form.Label>Incident Date :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="incident_date"
                  placeholder="YYYY-MM-DD"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.incident_date}
                  className={touched.incident_date && errors.incident_date ? 'has-error' : null}
                />
                {touched.incident_date && errors.incident_date ? (
                  <div className="error-message">{errors.incident_date}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formDatePublished">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={datePublishedPopover}
                >
                  <Form.Label>Date Published :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="date_published"
                  placeholder="YYYY-MM-DD"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.date_published}
                  className={touched.date_published && errors.date_published ? 'has-error' : null}
                />
                {touched.date_published && errors.date_published ? (
                  <div className="error-message">{errors.date_published}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formDateDownloaded">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={dateDownloadedPopover}
                >
                  <Form.Label>Date Downloaded :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="date_downloaded"
                  placeholder="YYYY-MM-DD"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.date_downloaded}
                  className={touched.date_downloaded && errors.date_downloaded ? 'has-error' : null}
                />
                {touched.date_downloaded && errors.date_downloaded ? (
                  <div className="error-message">{errors.date_downloaded}</div>
                ) : null}
              </Form.Group>
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
              <Form.Group controlId="formImageUrl">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={imageAddressPopover}
                >
                  <Form.Label>Image Address :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="image_url"
                  placeholder="Image URL"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.image_url}
                  className={touched.image_url && errors.image_url ? 'has-error' : null}
                />
                {touched.image_url && errors.image_url ? (
                  <div className="error-message">{errors.image_url}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formIncidentID">
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={incidentIDPopover}
                >
                  <Form.Label>Incident ID :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  name="incident_id"
                  placeholder="OPTIONAL"
                  onChange={(evt) => {
                    handleChange(evt);
                    updateRelated(evt.target.value);
                  }}
                  onBlur={handleBlur}
                  value={values.incident_id}
                  className={touched.incident_id && errors.incident_id ? 'has-error' : null}
                />
                {touched.incident_id && errors.incident_id ? (
                  <div className="error-message">{errors.incident_id}</div>
                ) : null}
              </Form.Group>
              <Form.Group controlId="formText">
                <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={textPopover}>
                  <Form.Label>Text :</Form.Label>
                </OverlayTrigger>
                <Form.Control
                  as="textarea"
                  rows={30}
                  type="text"
                  name="text"
                  placeholder="Text of the report"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.text}
                  className={touched.text && errors.text ? 'has-error' : null}
                />
                {touched.text && errors.text ? (
                  <div className="error-message">{errors.text}</div>
                ) : null}
              </Form.Group>
              {/*Submit button that is disabled after button is clicked/form is in the process of submitting*/}
              <p>
                Submitted reports are added to a <Link to="/apps/submitted">review queue </Link>
                to be resolved to a new or existing incident record. Incidents are reviewed and
                merged into the database after enough incidents are pending.
              </p>
              <BUTTON variant="primary" type="submit" disabled={isSubmitting}>
                {incident ? 'Update' : 'Submit'}
              </BUTTON>
              <RelatedLayout related={relatedIncidents} />
            </FORM>
            <Container className={isAdmin ? 'd-block' : 'd-none'}>
              <h2>Advanced: Add by CSV</h2>
              <p>
                The header row of the file is assumed to match the names of the inputs in the form.
                Each row will be processed, one at a time, so that it flows through the form
                validations before submitting.
              </p>
              <p>
                Record {csvIndex + 1} of {csvData.length}
              </p>
              <CSVReader
                onDrop={(dropped) => {
                  handleOnDrop(dropped);
                  setValues(csvData[csvIndex]['data']);
                }}
                onError={handleOnError}
                config={{ header: true }}
                noDrag
                addRemoveButton
              >
                <span>Click to upload.</span>
              </CSVReader>
              <Container className="text-center py-3">
                <Button className="mr-2" onClick={() => previousRecord(setValues)}>
                  &lt; Previous
                </Button>
                <Button onClick={() => nextRecord(setValues)}>Next &gt;</Button>
              </Container>
            </Container>
          </>
        )}
      </Formik>
    </CONTAINER>
  );
};

export default IncidentForm;
