import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { CSVReader } from 'react-papaparse';
import { useQueryParams, StringParam, ArrayParam, encodeDate, withDefault } from 'use-query-params';
import Link from 'components/ui/Link';
import RelatedIncidents from 'components/RelatedIncidents';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { format, parse } from 'date-fns';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_SUBMISSIONS, INSERT_SUBMISSION } from '../../graphql/submissions';
import isString from 'lodash/isString';
import SubmissionForm, { schema } from 'components/submissions/SubmissionForm';
import { Formik } from 'formik';
import { stripMarkdown } from 'utils/typography';
import isArray from 'lodash/isArray';

const CustomDateParam = {
  encode: encodeDate,
  decode: (value) => {
    const result = parse(value, 'yyyy-MM-dd', new Date());

    if (result.toString() == 'Invalid Date') {
      return undefined;
    }

    return value;
  },
};

const queryConfig = {
  url: withDefault(StringParam, ''),
  title: withDefault(StringParam, ''),
  authors: withDefault(StringParam, ''),
  submitters: withDefault(StringParam, ''),
  incident_date: withDefault(CustomDateParam, ''),
  date_published: withDefault(CustomDateParam, ''),
  date_downloaded: withDefault(CustomDateParam, ''),
  image_url: withDefault(StringParam, ''),
  incident_id: withDefault(StringParam, ''),
  text: withDefault(StringParam, ''),
  editor_notes: withDefault(StringParam, ''),
  tags: withDefault(ArrayParam, []),
};

const SubmitForm = () => {
  const { isRole } = useUserContext();

  const [query] = useQueryParams(queryConfig);

  const [submission, setSubmission] = useState({ ...query });

  const [csvData, setCsvData] = useState([]);

  const [csvIndex, setCsvIndex] = useState(0);

  const addToast = useToastContext();

  // See https://github.com/apollographql/apollo-client/issues/5419
  useQuery(FIND_SUBMISSIONS);

  const [insertSubmission] = useMutation(INSERT_SUBMISSION, { refetchQueries: [FIND_SUBMISSIONS] });

  useEffect(() => {
    if (csvData[csvIndex]) {
      setSubmission(csvData[csvIndex]);
    }
  }, [csvIndex, csvData]);

  const handleCSVError = (err, file, inputElem, reason) => {
    addToast({
      message: `Unable to upload: ${reason}`,
      severity: SEVERITY.danger,
    });
  };

  const previousRecord = () => {
    setCsvIndex(Math.max(0, csvIndex - 1));
  };

  const nextRecord = () => {
    setCsvIndex(Math.min(csvData.length - 1, csvIndex + 1));
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const date_submitted = format(new Date(), 'yyyy-MM-dd');

      const submission = {
        ...values,
        incident_id: values.incident_id == '' ? 0 : values.incident_id,
        date_submitted,
        date_modified: date_submitted,
        description: values.text.substring(0, 200),
        authors: isString(values.authors) ? values.authors.split(',') : values.authors,
        submitters: values.submitters
          ? !isArray(values.submitters)
            ? values.submitters.split(',').map((s) => s.trim())
            : values.submitters
          : ['Anonymous'],
        plain_text: await stripMarkdown(values.text),
      };

      await insertSubmission({ variables: { submission } });

      resetForm();

      addToast({
        message: (
          <>
            {'Report successfully added to review queue. It will appear on the  '}
            <Link to="/apps/submitted">review queue page</Link> within an hour.
          </>
        ),
        severity: SEVERITY.success,
      });
    } catch (e) {
      addToast({
        message: 'Was not able to create the report, please review the form and try again.',
        severity: SEVERITY.warning,
      });
    }
  };

  return (
    <div className="my-5">
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={submission}
        enableReinitialize={true}
      >
        {({ isSubmitting, submitForm, values }) => (
          <>
            <SubmissionForm />

            <p className="mt-4">
              Submitted reports are added to a <Link to="/apps/submitted">review queue </Link>
              to be resolved to a new or existing incident record. Incidents are reviewed and merged
              into the database after enough incidents are pending.
            </p>

            <Button
              onClick={submitForm}
              className="mt-3"
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>

            <RelatedIncidents incident={values} />
          </>
        )}
      </Formik>

      {isRole('submitter') && (
        <Container className="mt-5 p-0">
          <h2>Advanced: Add by CSV</h2>
          <p>
            The header row of the file is assumed to match the names of the inputs in the form. Each
            row will be processed, one at a time, so that it flows through the form validations
            before submitting.
          </p>
          <p>
            Record {csvIndex + 1} of {csvData.length}
          </p>
          <div className="d-flex justify-content-center my-3">
            <Button className="me-4" onClick={previousRecord}>
              &lt; Previous
            </Button>
            <Button onClick={nextRecord}>Next &gt;</Button>
          </div>
          <CSVReader
            onDrop={(data) => {
              setCsvData(data);
              addToast({
                message: 'File uploaded',
                severity: SEVERITY.info,
              });
            }}
            onError={handleCSVError}
            config={{ header: true }}
            noDrag
            addRemoveButton
          >
            <span>Click to upload.</span>
          </CSVReader>
        </Container>
      )}
    </div>
  );
};

export default SubmitForm;
