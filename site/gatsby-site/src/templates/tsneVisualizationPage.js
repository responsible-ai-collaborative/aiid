import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import TsneVisualization from 'components/cite/TsneVisualization';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';

function TsneVisulizationPage(props) {
  const { t } = useTranslation();

  const spatialIncidents = props.pageContext.spatialIncidents;

  const classifications = props.pageContext.classifications.filter((c) => c.publish);

  const csetClassifications = props.pageContext.csetClassifications;

  // meta tags

  const metaTitle = t('Spatial Visualization');

  const metaDescription = t('Spatial Visualization');

  return (
    <Layout className="max-w-full w-full" {...props}>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <StyledHeading>{t(metaDescription)}</StyledHeading>
      </div>

      <TsneVisualization
        currentIncidentId={Number(
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('incident') || -1
            : -1
        )}
        incidents={spatialIncidents}
        classifications={classifications}
        csetClassifications={csetClassifications}
      />
      <p className="mt-4" style={{ maxWidth: '1000px' }}>
        <Trans i18nKey="tsneDescription">
          The spatial view above shows each incident in the database as a plot point containing its
          incident ID number. Incidents are positioned so that those with similar report texts fall
          closer together. For example, incidents concerning autonomous vehicles form a tight
          cluster. We determine incident similarity using a natural language processing system,
          which you can read more about in{' '}
          <LocalizedLink to="/blog/using-ai-to-connect-ai-incidents">
            {' '}
            our blog post on its rollout
          </LocalizedLink>
          .
        </Trans>
      </p>
    </Layout>
  );
}

export default TsneVisulizationPage;
