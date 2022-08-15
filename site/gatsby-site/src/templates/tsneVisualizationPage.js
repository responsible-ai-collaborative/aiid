import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import TsneVisualization from 'components/cite/TsneVisualization';
import { useTranslation } from 'react-i18next';

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

      <TsneVisualization currentIncidentId={-1} />
    </Layout>
  );
}

export default TsneVisulizationPage;
