import React from 'react';
import Link from '../ui/Link';
import { FIND_SUBMISSIONS } from '../../graphql/submissions';
import { useQuery } from '@apollo/client';
import { Trans } from 'react-i18next';
import ListSkeleton from 'elements/Skeletons/List';
import SubmissionList from './SubmissionList';

const SubmissionListWrapper = () => {
  const { data, loading } = useQuery(FIND_SUBMISSIONS);

  return (
    <>
      <p className="paragraph">
        <Trans ns="submitted" i18nKey="description">
          The following incident reports have been <Link to="/apps/submit">submitted </Link> by
          users and are pending review by editors. Only editors may promote these records to
          incident reports in the database.
        </Trans>
      </p>
      {loading && <ListSkeleton />}
      {data && <SubmissionList data={data} />}
    </>
  );
};

export default SubmissionListWrapper;
