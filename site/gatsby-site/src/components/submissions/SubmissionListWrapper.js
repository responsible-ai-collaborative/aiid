import React from 'react';
import Link from '../ui/Link';
import { Trans } from 'react-i18next';
import SubmissionList from './SubmissionList';

const SubmissionListWrapper = () => {
  return (
    <>
      <p className="paragraph">
        <Trans ns="submitted" i18nKey="description">
          The following incident reports have been <Link to="/apps/submit">submitted </Link> by
          users and are pending review by editors. Only editors may promote these records to
          incident reports in the database.
        </Trans>
      </p>
      <SubmissionList />
    </>
  );
};

export default SubmissionListWrapper;
