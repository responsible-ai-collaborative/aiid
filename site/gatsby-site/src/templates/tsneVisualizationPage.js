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

  const metaTitle = t('Spatial visualization');

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
          The visualization below plots incidents closer together according to the similarity of
          their reports texts, as identified through{' '}
          <LocalizedLink to="/blog/using-ai-to-connect-ai-incidents">
            our natural-language processing system
          </LocalizedLink>
        </Trans>
        .
      </p>

      <TsneVisualization
        currentIncidentId={
          Number(new URLSearchParams(window.location.search).get('incident')) || -1
        }
      />
    </Layout>
  );
}

export default TsneVisulizationPage;
