import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import TsneVisualization from 'components/cite/TsneVisualization';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';

function TsneVisulizationPage(props) {
  const { t } = useTranslation();

  // meta tags

  const metaTitle = t('Spatial Visualization');

  const metaDescription = t('Spatial Visualization');

  const canonicalUrl = 'https://incidentdatabase.ai/summaries/spatial';

  return (
    <Layout {...props}>
      <AiidHelmet {...{ metaTitle, metaDescription, canonicalUrl }}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <StyledHeading>{metaDescription}</StyledHeading>
      </div>

      <p>
        <Trans>
          The visualization below shows incidents closer together when a{' '}
          <LocalizedLink to="/blog/using-ai-to-connect-ai-incidents">
            natural language processing system
          </LocalizedLink>{' '}
          identifies their text as being semantically similar.
        </Trans>
      </p>

      <TsneVisualization
        currentIncidentId={Number(
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('incident') || -1
            : -1
        )}
      />
    </Layout>
  );
}

export default TsneVisulizationPage;
