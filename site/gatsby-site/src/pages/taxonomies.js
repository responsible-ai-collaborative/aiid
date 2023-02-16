import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { graphql } from 'gatsby';
import Layout from 'components/Layout';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import TaxonomyGraphCarousel from '../../src/components/TaxonomyGraphCarousel.js';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import TranslationBadge from 'components/i18n/TranslationBadge';

export default function Taxonomies({ data, ...props }) {
  const { t } = useTranslation();

  const title = t('Taxonomies');

  const metaTitle = t('List of taxonomies');

  const metaDescription = t('This is the list of taxonomies supported in AIID');

  return (
    <Layout {...props}>
      <AiidHelmet {...{ title, metaTitle, metaDescription, path: props.location.pathname }}>
        <title>{title}</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <StyledHeading>{metaTitle}</StyledHeading>
        <TranslationBadge originalLanguage="en" />
      </div>
      <StyledMainWrapper>
        <h2>
          <Trans>Applied Taxonomies</Trans>
        </h2>
        <ul className="list-revert pl-8">
          <li>
            <p>
              <Trans>
                <LocalizedLink to="/taxonomy/cset">
                  Center for Security and Emerging Technology (CSET)
                </LocalizedLink>
                . This is a taxonomy detailing many attributes of AI incidents of relevance to the
                public policy community.
              </Trans>
            </p>
            <TaxonomyGraphCarousel
              data={data}
              namespace="CSET"
              axes={['Harm Distribution Basis', 'Harm Type', 'System Developer', 'Severity']}
            />
          </li>
          <li>
            <p>
              <LocalizedLink to="/taxonomy/gmf/">Goals, Methods, and Failures (GMF)</LocalizedLink>.
              This is a taxonomy detailing the technological and process factors producing an
              incident.
            </p>
            <TaxonomyGraphCarousel
              data={data}
              namespace="GMF"
              axes={['Known AI Goal', 'Known AI Technology', 'Known AI Technical Failure']}
            />
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
      </StyledMainWrapper>
    </Layout>
  );
}

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
        incident_id
        namespace
        attributes {
          short_name
          value_json
        }
      }
    }
  }
`;
