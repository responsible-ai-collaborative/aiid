import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Featured from 'components/landing/Featured';
import Leaderboards from 'components/landing/Leaderboards';
import Blog from 'components/landing/Blog';
import Sponsors from 'components/landing/Sponsors';
import AboutDatabase from 'components/landing/AboutDatabase ';
import LatestReports from 'components/landing/LatestReports';
import QuickSearch from 'components/landing/QuickSearch';
import QuickAdd from 'components/landing/QuickAdd';
import RandomReports from 'components/landing/RandomReports';
import Hero from 'components/landing/Hero';
import NewsletterSignup from 'components/landing/NewsletterSignup';
import { useTranslation } from 'react-i18next';
import { graphql } from 'gatsby';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import Container from '../elements/Container';
import CommonEntities from 'components/entities/CommonEntities';
import config from '../../config';
import sortBy from 'lodash/sortBy';
import PostPreviewNew from 'components/blog/PrismicPostPreview';

const LandingPage = (props) => {
  const { data } = props;

  let { latestPost, latestPostOld, latestReportIncidents } = data;

  const { locale: language } = useLocalization();

  const latestReports = latestReportIncidents.edges.map((incident) => {
    const sortedReports = sortBy(incident.node.reports, ['epoch_date_submitted'], ['desc']);

    const report = sortedReports.map((report) => report)[0];

    if (report.language !== language) {
      const translation = data[`latestReports_${language}`].edges.find(
        (translation) => translation.node.report_number === report.report_number
      );

      report.title = translation.node.title;
      report.text = translation.node.text;
    }
    const updatedIncident = {
      incident_id: incident.node.incident_id,
      ...report,
    };

    return updatedIncident;
  });

  const { t } = useTranslation(['translation', 'landing']);

  const title = t('Welcome to the Artificial Intelligence Incident Database', { ns: 'landing' });

  const metaTitle = title;

  const metaDescription = t('The starting point for information about the AI Incident Database', {
    ns: 'landing',
  });

  const metaImage = 'https://incidentdatabase.ai/logos/AIID_1000x1000px.png';

  const ldJSON = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: config.gatsby.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: config.gatsby.siteUrl + '/apps/discover?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    // Tailwind has max-w-6xl but no plain w-6xl... 72rem = 6xl
    <div className="max-w-full 2xl:w-[72rem]" {...props}>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }}>
        <title>{title}</title>
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJSON) }}
        />
      </AiidHelmet>
      <Container>
        <div>
          <Hero />
        </div>

        <div className="mb-10">
          <QuickSearch />
        </div>

        <div className="mb-5 md:mb-10">
          <div>
            <LatestReports latestReports={latestReports} />
          </div>
        </div>

        <div className="mb-5 md:mb-10">
          <div>
            <CommonEntities />
          </div>
        </div>

        <div className="mb-5 md:mb-10">
          <div className="flex flex-col items-center">
            <QuickAdd />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5 md:gap-10 mb-5 md:mb-10 flex-wrap">
          <div className="flex-1 max-w-full sm:max-w-[50%] md:max-w-full lg:max-w-[50%]">
            <AboutDatabase />
          </div>
          {(latestPost?.edges?.length > 0 || latestPostOld?.nodes?.length > 0) && (
            <div className="flex-1 max-w-full sm:max-w-[50%] md:max-w-full lg:max-w-[50%]">
              {latestPost.edges.length > 0 ? (
                <PostPreviewNew post={latestPost.edges[0].node} latestPost={true} />
              ) : latestPostOld.nodes.length > 0 ? (
                <Blog post={latestPostOld.nodes[0]} />
              ) : (
                <></>
              )}
            </div>
          )}
        </div>

        <div className="mb-10 md:mb-16">
          <div>
            <Featured />
          </div>
        </div>

        <div className="mb-10 md:mb-16">
          <div>
            <Leaderboards />
          </div>
        </div>

        <div className="mb-5 md:mb-10 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5 md:gap-10 flex-wrap">
          <div className="flex-1 lg:max-w-[50%]">
            <NewsletterSignup />
          </div>
          <div className="flex-1 lg:max-w-[50%]">
            <RandomReports />
          </div>
        </div>

        <div>
          <Sponsors />
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;

export const query = graphql`
  query LandingPageQuery($latestReportNumber: Int, $latestReportNumbers: [Int], $locale: String!) {
    latestReportIncident: allMongodbAiidprodIncidents(
      filter: { reports: { elemMatch: { report_number: { eq: $latestReportNumber } } } }
    ) {
      edges {
        node {
          incident_id
        }
      }
    }
    latestReportIncidents: allMongodbAiidprodIncidents(
      filter: { reports: { elemMatch: { report_number: { in: $latestReportNumbers } } } }
    ) {
      edges {
        node {
          incident_id
          reports {
            report_number
            title
            text
            epoch_date_submitted
            image_url
            report_number
            cloudinary_id
            language
            source_domain
            url
          }
        }
      }
    }
    latestReport: mongodbAiidprodReports(report_number: { in: $latestReportNumbers }) {
      title
      text
      epoch_date_submitted
      image_url
      report_number
      cloudinary_id
      language
    }
    latestReports_es: allMongodbTranslationsReportsEs(
      filter: { report_number: { in: $latestReportNumbers } }
    ) {
      edges {
        node {
          title
          text
          report_number
        }
      }
    }
    latestReports_fr: allMongodbTranslationsReportsFr(
      filter: { report_number: { in: $latestReportNumbers } }
    ) {
      edges {
        node {
          title
          text
          report_number
        }
      }
    }
    latestReports_en: allMongodbTranslationsReportsEn(
      filter: { report_number: { in: $latestReportNumbers } }
    ) {
      edges {
        node {
          title
          text
          report_number
        }
      }
    }
    latestPost: allPrismicBlog(
      filter: { data: { language: { eq: $locale } } }
      sort: { data: { date: DESC } }
    ) {
      edges {
        node {
          uid
          lang
          data {
            metatitle
            metadescription
            slug
            aitranslated
            language
            title {
              text
            }
            content {
              richText
              text
              html
            }
            image {
              url
              gatsbyImageData
            }
            date
            author
          }
        }
      }
    }
    latestPostOld: allMdx(
      filter: { fields: { slug: { glob: "/blog/**" }, locale: { eq: $locale } } }
      sort: { frontmatter: { date: DESC } }
      limit: 1
    ) {
      nodes {
        fields {
          slug
          title
          locale
        }
        excerpt
        frontmatter {
          slug
          date
          author
          image {
            childImageSharp {
              gatsbyImageData(layout: FIXED)
            }
          }
        }
      }
    }
  }
`;
