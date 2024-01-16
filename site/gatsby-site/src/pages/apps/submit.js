import React from 'react';
import SubmitForm from 'components/forms/SubmitForm';
import AiidHead from 'components/AiidHead';
import { useTranslation } from 'react-i18next';

const SubmitPage = (props) => {
  return (
    <div className="md:max-w-5xl" {...props}>
      <SubmitForm />
    </div>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation(['submit']);

  const metaTitle = t('New Incident Report');

  return (
    <AiidHead path={pathname} metaTitle={metaTitle}>
      <title>{metaTitle}</title>
    </AiidHead>
  );
};

export default SubmitPage;
