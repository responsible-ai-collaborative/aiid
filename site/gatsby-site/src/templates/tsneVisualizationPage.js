import React from 'react';
import HeadContent from 'components/HeadContent';
import TsneVisualization from 'components/cite/TsneVisualization';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';

function TsneVisulizationPage(props) {
  const { t } = useTranslation();

  const spatialIncidents = props.pageContext.spatialIncidents;

  const classifications = props.pageContext.classifications;

  const taxa = props.pageContext.taxa;

  const csetClassifications = props.pageContext.csetClassifications;

  const metaDescription = t('Spatial Visualization');

  return (
    <div className="max-w-full w-full" {...props}>
      <div className={'titleWrapper'}>
        <h1>{t(metaDescription)}</h1>
      </div>

      <TsneVisualization
        currentIncidentId={Number(
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('incident') || -1
            : -1
        )}
        incidents={spatialIncidents}
        {...{
          classifications,
          taxa,
          csetClassifications,
        }}
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
    </div>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation();

  const metaTitle = t('Spatial Visualization');

  const metaDescription = t('Spatial Visualization');

  return <HeadContent path={pathname} {...{ metaTitle, metaDescription }} metaType="website" />;
};

export default TsneVisulizationPage;
