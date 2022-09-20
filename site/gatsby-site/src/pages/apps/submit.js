import React from 'react';
import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { StyledHeading } from 'components/styles/Docs';
import SubmitForm from 'components/forms/SubmitForm';
import { Trans, useTranslation } from 'react-i18next';
import AiidHelmet from 'components/AiidHelmet';

const SubmitPage = (props) => {
  const { t } = useTranslation(['submit']);

  return (
    <Layout {...props}>
      <AiidHelmet>
        <title>{t('New Incident Report')}</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <StyledHeading>
          <Trans ns="submit">New Incident Report</Trans>
        </StyledHeading>
      </div>
      <p>
        <Trans ns="submit" i18nKey="submitFormDescription">
          The following form will create a new incident report for{' '}
          <Link to="/apps/submitted">review </Link> and inclusion into the AI Incident Database.
          Fields beginning with an asterisk (*) are required. Please carefully check your entries
          for content issues (e.g., accidental copy and paste of advertisements). For details on the
          database ingestion process, please check the{' '}
          <Link to="/research/1-criteria/">research pages</Link>
          or <Link to="/contact">contact us with questions.</Link>
        </Trans>
      </p>
      <SubmitForm />
    </Layout>
  );
};

export default SubmitPage;
