import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from '../../components/ui/Link';
import SubmissionReview from '../../components/submissions/SubmissionReview';
import { FIND_SUBMISSIONS } from '../../graphql/submissions';
import { useQuery } from '@apollo/client';
import { Trans } from 'react-i18next';
import ListSkeleton from 'elements/Skeletons/List';

const SubmissionList = () => {
  const { data, loading } = useQuery(FIND_SUBMISSIONS);

  return (
    <div className="bootstrap">
      <p className="paragraph">
        <Trans ns="submitted" i18nKey="description">
          The following incident reports have been <Link to="/apps/submit">submitted </Link> by
          users and are pending review by editors. Only editors may promote these records to
          incident reports in the database.
        </Trans>
      </p>
      <ListGroup className="mb-5" data-cy="submissions">
        {loading && <ListSkeleton />}
        {data?.submissions
          .map((submission) => ({ ...submission, __typename: undefined }))
          .sort(
            (a, b) => new Date(a.date_submitted).getTime() - new Date(b.date_submitted).getTime()
          )
          .map((submission) => (
            <ListGroup.Item key={submission._id} className="m-0 p-0" data-cy="submission">
              <SubmissionReview submission={submission} />
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default SubmissionList;
