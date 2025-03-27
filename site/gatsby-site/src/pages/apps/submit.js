import React from 'react';
import SubmitForm from 'components/forms/SubmitForm';
import HeadContent from 'components/HeadContent';
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

  const metaDescription = t(
    'Submit a new incident report to the Artificial Intelligence Incident Database'
  );

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />;
};

export default SubmitPage;
