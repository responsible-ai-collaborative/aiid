import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { CSVReader } from 'react-papaparse';
import cx from 'classnames';

import Link from 'components/Link';
import RelatedIncidents from 'components/RelatedIncidents';
import IncidentReportForm from 'components/forms/IncidentReportForm';
import { FormStyles } from 'components/styles/Form';

import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

const SubmitForm = () => {
  const { isAdmin, user } = useUserContext();

  const [incident, setIncident] = useState({});

  const [csvData, setCsvData] = useState([]);

  const [csvIndex, setCsvIndex] = useState(0);

  const addToast = useToastContext();

  useEffect(() => {
    if (csvData[csvIndex]) {
      setIncident(csvData[csvIndex]);
    }
  }, [csvIndex, csvData]);

  const handleCSVError = (err, file, inputElem, reason) => {
    console.log(err, file, inputElem, reason);
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    try {
      let submitIncidentID = 0;

      if (incident.incident_id) {
        submitIncidentID = incident.incident_id;
      }
      await user.functions.createReportForReview({
        incident_id: submitIncidentID,
        ...values,
      });
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

    resetForm();
    setSubmitting(false);
  };

  return (
    <FormStyles className="p-5 mb-5">
      <IncidentReportForm incident={incident} onUpdate={setIncident} onSubmit={handleSubmit} />
      <RelatedIncidents incident={incident} isSubmitted={false} />
      <Container className={cx('mt-5 p-0', !isAdmin && 'd-none')}>
        <h2>Advanced: Add by CSV</h2>
        <p>
          The header row of the file is assumed to match the names of the inputs in the form. Each
          row will be processed, one at a time, so that it flows through the form validations before
          submitting.
        </p>
        <p>
          Record {csvIndex + 1} of {csvData.length}
        </p>
        <div className="d-flex justify-content-center my-3">
          <Button className="mr-4" onClick={previousRecord}>
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
    </FormStyles>
  );
};

export default SubmitForm;
