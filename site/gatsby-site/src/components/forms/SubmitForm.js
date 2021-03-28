import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { CSVReader } from 'react-papaparse';
import cx from 'classnames';

import RelatedIncidents from 'components/RelatedIncidents';
import IncidentForm from 'components/forms/IncidentForm';
import { FormStyles } from 'components/styles/Form';

import { useUserContext } from 'contexts/userContext';

const SubmitForm = () => {
  const { isAdmin, user } = useUserContext();
  const [incident, setIncident] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [csvIndex, setCsvIndex] = useState(0);

  useEffect(() => {
    setIncident(csvData[csvIndex]);
  }, [csvIndex, csvData]);

  const handleCSVError = (err, file, inputElem, reason) => {
    console.log(err, file, inputElem, reason);
  };
  const previousRecord = () => {
    setCsvIndex(Math.max(0, csvIndex - 1));
  };
  const nextRecord = () => {
    setCsvIndex(Math.min(csvData.length - 1, csvIndex + 1));
  };

  const handleSubmit = (values) => {
    user.functions.createReportForReview(values);
  };

  return (
    <FormStyles className="p-5 mb-5">
      <IncidentForm incident={incident} onUpdate={setIncident} onSubmit={handleSubmit} />
      <RelatedIncidents incident={incident} />
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
          onDrop={setCsvData}
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
