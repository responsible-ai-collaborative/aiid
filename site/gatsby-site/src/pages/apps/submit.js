import React from 'react';
import SubmitForm from 'components/forms/SubmitForm';
import AiidHelmet from 'components/AiidHelmet';
import { useTranslation } from 'react-i18next';

const SubmitPage = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation(['submit']);

  return (
    <div className="md:max-w-5xl" {...props}>
      <AiidHelmet path={pathname}>
        <title>{t('New Incident Report')}</title>
      </AiidHelmet>
      <SubmitForm />
    </div>
  );
};

export default SubmitPage;
