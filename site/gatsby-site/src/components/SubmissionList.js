import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Spinner } from 'react-bootstrap';

import Link from 'components/ui/Link';
import ReportedIncident from 'components/ReportedIncident';

import { useSubmissionsContext } from 'contexts/submissionsContext';

const SubmissionList = () => {
  const { submissions } = useSubmissionsContext();

  return (
    <>
      <p className="paragraph">
        The following incident reports have been <Link to="/apps/submit">submitted </Link> by users
        and are pending review by editors. Only editors may promote these records to incident
        reports in the database.
      </p>
      <ListGroup className="mb-5" data-cy="submissions">
        {submissions.length < 1 && (
          <>
            <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />{' '}
            <p>Loading Submissions...</p>
          </>
        )}
        {submissions
          .sort((a, b) => a.incident_date - b.incident_date)
          .map((node) => (
            <ListGroup.Item key={node._id} className="m-0 p-0">
              <ReportedIncident incident={node} />
            </ListGroup.Item>
          ))}
      </ListGroup>
    </>
  );
};

export default SubmissionList;
