import React from 'react';
import Layout from 'components/Layout';
import SubmitForm from 'components/forms/SubmitForm';
import AiidHelmet from 'components/AiidHelmet';
import { useTranslation } from 'react-i18next';

const SubmitPage = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation(['submit']);

  return (
    <Layout {...props} className="md:max-w-5xl">
      <AiidHelmet path={pathname}>
        <title>{t('New Incident Report')}</title>
      </AiidHelmet>
      <SubmitForm />
    </Layout>
  );
};

export default SubmitPage;
