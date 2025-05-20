import React from 'react';
import Featured from 'components/landing/Featured';
import Leaderboards from 'components/landing/Leaderboards';
import Blog from 'components/landing/Blog';
import Sponsors from 'components/landing/Sponsors';
import AboutDatabase from 'components/landing/AboutDatabase ';
import LatestReports from 'components/landing/LatestReports';
import QuickSearch from 'components/landing/QuickSearch';
import QuickAdd from 'components/landing/QuickAdd';
import RandomIncidents from 'components/landing/RandomIncidents';
import Hero from 'components/landing/Hero';
import NewsletterSignup from 'components/landing/NewsletterSignup';
import { useTranslation } from 'react-i18next';
import { graphql } from 'gatsby';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import Container from '../elements/Container';
import config from '../../config';
import PostPreviewNew from 'components/blog/PrismicPostPreview';
import HeadContent from 'components/HeadContent';

const LandingPage = (props) => {
  const { data } = props;

  const { latestIncidents, latestIncidentsReportNumbers, sponsors } = props.pageContext;

  let { latestPrismicPost, latestPostOld } = data;

  let latestBlogPost = null;

  if (!latestPostOld || latestPostOld.nodes.length === 0) {
    latestBlogPost = latestPrismicPost;
  } else if (!latestPrismicPost || latestPrismicPost.nodes.length === 0) {
    latestBlogPost = latestPostOld;
  } else {
    const mdxDate = new Date(latestPostOld?.nodes[0]?.frontmatter?.date);

    const prismicDate = new Date(latestPrismicPost?.nodes[0]?.data.date);

    // Display prismic post if it's the latest post or if it's newer than the latest mdx post
    latestBlogPost = mdxDate > prismicDate ? latestPostOld : latestPrismicPost;
  }

  const { locale: language } = useLocalization();

  const latestIncidentsTranslated = latestIncidents.map((incident) => {
    const report = incident.reports.find((r) =>
      latestIncidentsReportNumbers.includes(r.report_number)
    );

    // Set incident title translation
    const incidentTranslation = data.incidentTranslations?.nodes.find(
      (translation) => translation.incident_id === incident.incident_id
    );

    if (incidentTranslation) {
      incident.title = incidentTranslation.title;
      incident.isTranslated = true;
    }

    if (report.language !== language) {
      const translation = data.latestIncidentsReportsTranslations?.edges.find(
        (translation) =>
          translation.node.report_number === report.report_number &&
          translation.node.language === language
      );

      if (translation) {
        report.title = translation.node.title;
        report.text = translation.node.text;
      } else {
        console.warn(`No latestReports_${language} for report ${report.report_number}`);
      }
    }
    const updatedIncident = {
      ...incident,
      reports: [report],
    };

    return updatedIncident;
  });

  return (
    // Tailwind has max-w-6xl but no plain w-6xl... 72rem = 6xl
    <div className="2xl:w-[72rem]" {...props}>
      <Container>
        <div>
          <Hero />
        </div>

        <div className="mb-10">
          <QuickSearch />
        </div>

        {latestIncidents.length > 0 && (
          <div className="mb-5 md:mb-10">
            <div>
              <LatestReports latestIncidents={latestIncidentsTranslated} />
            </div>
          </div>
        )}

        <div className="mb-5 md:mb-10">
          <div className="flex flex-col items-center">
            <QuickAdd />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5 md:gap-10 mb-5 md:mb-10 flex-wrap">
          <div className="flex-1 max-w-full sm:max-w-[50%] md:max-w-full lg:max-w-[50%]">
            <AboutDatabase />
          </div>
          {(latestBlogPost?.edges?.length > 0 || latestBlogPost?.nodes?.length > 0) && (
            <div className="flex-1 max-w-full sm:max-w-[50%] md:max-w-full lg:max-w-[50%]">
              {latestBlogPost.nodes.length > 0 && latestBlogPost.nodes[0].data ? (
                <PostPreviewNew post={latestBlogPost.nodes[0]} latestBlogPost={true} />
              ) : latestBlogPost.nodes.length > 0 ? (
                <Blog post={latestBlogPost.nodes[0]} />
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
          {latestIncidents.length > 0 && (
            <div className="flex-1 lg:max-w-[50%]">
              <RandomIncidents />
            </div>
          )}
        </div>

        <div>
          <Sponsors sponsors={sponsors} />
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;

export function Head({ location }) {
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

  const stringified = JSON.stringify(ldJSON, null, 2);

  return (
    <>
      <script type="application/ld+json">{stringified}</script>
      <HeadContent
        {...{ metaTitle, metaDescription, path: location.pathname, metaImage }}
        metaType="website"
        title={title}
      />
    </>
  );
}

export const query = graphql`
  query LandingPageQuery(
    $latestReportNumber: Int
    $latestIncidentsReportNumbers: [Int]
    $locale: String!
    $latestIncidentIds: [Int]
  ) {
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
      filter: { reports: { elemMatch: { report_number: { in: $latestIncidentsReportNumbers } } } }
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
    latestReport: mongodbAiidprodReports(report_number: { in: $latestIncidentsReportNumbers }) {
      title
      text
      epoch_date_submitted
      image_url
      report_number
      cloudinary_id
      language
    }
    latestIncidentsReportsTranslations: allMongodbTranslationsReports(
      filter: { report_number: { in: $latestIncidentsReportNumbers } }
    ) {
      edges {
        node {
          title
          text
          report_number
          language
        }
      }
    }
    incidentTranslations: allMongodbTranslationsIncidents(
      filter: { incident_id: { in: $latestIncidentIds }, language: { eq: $locale } }
    ) {
      nodes {
        title
        incident_id
        language
      }
    }
    latestPrismicPost: allPrismicBlog(
      filter: { data: { language: { eq: $locale } } }
      sort: { data: { date: DESC } }
      limit: 1
    ) {
      nodes {
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
          previewText
        }
        body
        excerpt
        frontmatter {
          metaDescription
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
