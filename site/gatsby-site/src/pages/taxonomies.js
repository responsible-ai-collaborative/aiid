import React from 'react';
import { graphql } from 'gatsby';
import TaxonomyGraphCarousel from '../../src/components/TaxonomyGraphCarousel.js';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import TranslationBadge from 'components/i18n/TranslationBadge';
import HeadContent from 'components/HeadContent.js';

export default function Taxonomies({ data }) {
  const { t } = useTranslation();

  const metaTitle = t('List of taxonomies');

  return (
    <>
      <div className={'titleWrapper'}>
        <h1>{metaTitle}</h1>
        <TranslationBadge originalLanguage="en" />
      </div>
      <div className="styled-main-wrapper">
        <h2>
          <Trans>Applied Taxonomies</Trans>
        </h2>
        <ul className="list-revert pl-8">
          <li>
            <p>
              <Trans>
                <LocalizedLink to="/taxonomies/csetv1">
                  Center for Security and Emerging Technology (CSETv1)
                </LocalizedLink>{' '}
                The CSET AI Harm Taxonomy characterizes AI incidents and classifies harms of
                relevance to the public policy community.
              </Trans>
            </p>
            <TaxonomyGraphCarousel
              data={data}
              namespace="CSETv1"
              axes={['Harm Distribution Basis', 'Sector of Deployment']}
            />
          </li>
          <li>
            <p>
              <Trans>
                <LocalizedLink to="/taxonomies/gmf/">
                  Goals, Methods, and Failures (GMF)
                </LocalizedLink>
                . This is a taxonomy detailing the technological and process factors producing an
                incident.
              </Trans>
            </p>
            <TaxonomyGraphCarousel
              data={data}
              namespace="GMF"
              axes={['Known AI Goal', 'Known AI Technology', 'Known AI Technical Failure']}
            />
          </li>
          <li>
            <p>
              <Trans>
                <LocalizedLink to="/taxonomies/mit">MIT AI Risk Repository</LocalizedLink> The MIT
                AI Risk Repository contains detailed records of AI-related risks extracted from a
                variety of sources, categorized into high-level and mid-level taxonomies. Its
                high-level Causal Taxonomy includes attributes such as the entity responsible for
                the risk (human, AI, or other), the intent (intentional, unintentional, or other),
                and the timing (pre-deployment, post-deployment, or other). Its mid-level Domain
                Taxonomy categorizes risks into 23 specific domains like discrimination,
                misinformation, malicious use, and human-computer interaction issues.
              </Trans>
            </p>
          </li>
        </ul>

        <h2>
          <Trans>About Taxonomies</Trans>
        </h2>
        <p>
          <Trans>
            Taxonomies are contributed to the AI Incident Database by persons and organizations
            working to structure the data and provide views into the data. Each taxonomy must be of
            sufficient quality and completeness to be included in the AI Incident Database, but the
            taxonomies are the responsibility of the persons and organizations contributing them.
          </Trans>
        </p>
      </div>
    </>
  );
}

export const Head = (props) => {
  const { t } = useTranslation();

  const {
    location: { pathname },
  } = props;

  const title = t('Taxonomies');

  const metaTitle = t('List of taxonomies');

  const metaDescription = t('This is the list of taxonomies supported in AIID');

  return (
    <HeadContent
      path={pathname}
      title={title}
      metaTitle={metaTitle}
      metaDescription={metaDescription}
    />
  );
};

export const pageQuery = graphql`
  query TaxonomoyGraphCarouselTaxa {
    allMongodbAiidprodTaxa {
      nodes {
        namespace
        field_list {
          permitted_values
          short_name
        }
      }
    }
    allMongodbAiidprodClassifications {
      nodes {
        namespace
        attributes {
          short_name
          value_json
        }
      }
    }
  }
`;
