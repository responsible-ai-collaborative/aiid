import React from 'react';
import { graphql } from 'gatsby';
import HeadContent from 'components/HeadContent';
import MediaTreemap from 'components/visualizations/MediaTreemap';
import { Trans } from 'react-i18next';

const metaTitle = 'Media Landscape';

const metaDescription =
  'Which publications report AI incidents: every source domain in the database sized by its number of reports, by year.';

export default function MediaLandscapePage({ data }) {
  return (
    <>
      <div className="titleWrapper">
        <h1 className="tw-styled-heading">
          <Trans>{metaTitle}</Trans>
        </h1>
      </div>
      <p className="mb-4">
        <Trans>
          Every report in the database comes from a source domain. This treemap sizes each domain by
          its number of reports, for all years or a single publication year, and can group the
          domains by their top-level domain. Click a publication to zoom into the authors behind its
          reports.
        </Trans>
      </p>
      <MediaTreemap reports={data.reports.nodes} />
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  return (
    <HeadContent
      path={pathname}
      metaTitle={metaTitle}
      metaType="website"
      metaDescription={metaDescription}
    />
  );
};

export const pageQuery = graphql`
  query MediaLandscape {
    reports: allMongodbAiidprodReports {
      nodes {
        source_domain
        date_published
        authors
      }
    }
  }
`;
