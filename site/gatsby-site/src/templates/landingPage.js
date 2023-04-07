import React, { useEffect } from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Featured from 'components/landing/Featured';
import Leaderboards from 'components/landing/Leaderboards';
import Blog from 'components/landing/Blog';
import WordCounts from 'components/landing/WordCounts';
import Sponsors from 'components/landing/Sponsors';
import AboutDatabase from 'components/landing/AboutDatabase ';
import LatestReports from 'components/landing/LatestReports';
import QuickSearch from 'components/landing/QuickSearch';
import QuickAdd from 'components/landing/QuickAdd';
import RandomReports from 'components/landing/RandomReports';
import Hero from 'components/landing/Hero';
import { useTranslation } from 'react-i18next';
import { graphql } from 'gatsby';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import Container from '../elements/Container';
import CommonEntities from 'components/entities/CommonEntities';
import { useMenuContext } from 'contexts/MenuContext';
import { useLayoutContext } from 'contexts/LayoutContext';

const LandingPage = (props) => {
  const {
    pageContext: { wordCountsSorted },
    data,
  } = props;

  const localWordCounts = wordCountsSorted.filter((word, index) => index < 10);

  const { latestReport, latestReportIncident, latestPost } = data;

  const { isCollapsed, collapseMenu } = useMenuContext();

  const { setClassName } = useLayoutContext();

  latestReport.incident_id = latestReportIncident.incident_id;

  const { locale: language } = useLocalization();

  if (latestReport.language !== language) {
    const translation = data[`latestReport_${language}`];

    latestReport.title = translation.title;
    latestReport.text = translation.text;
  }

  const { t } = useTranslation(['translation', 'landing']);

  const title = t('Welcome to the Artificial Intelligence Incident Database', { ns: 'landing' });

  const metaTitle = title;

  const metaDescription = t('The starting point for information about the AI Incident Database', {
    ns: 'landing',
  });

  const metaImage = 'https://incidentdatabase.ai/logos/AIID_1000x1000px.png';

  useEffect(() => {
    if (isCollapsed) {
      collapseMenu(false);
    }
    setClassName('max-w-full 2xl:w-[72rem]');
  }, []);

  return (
    // Tailwind has max-w-6xl but no plain w-6xl... 72rem = 6xl
    <>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }}>
        <title>{title}</title>
        <meta property="og:type" content="website" />
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
            <LatestReports latestReport={latestReport} />
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
          <div className="flex-1 max-w-full sm:max-w-[50%] md:max-w-full lg:max-w-[50%]">
            <Blog post={latestPost.nodes[0]} />
          </div>
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
          <div className="flex-1 lg:max-w-[50%] grow">
            <WordCounts localWordCounts={localWordCounts} />
          </div>
          <div className="flex-1 lg:max-w-[50%] self-stretch">
            <RandomReports />
          </div>
        </div>

        <div>
          <Sponsors />
        </div>
      </Container>
    </>
  );
};

export default LandingPage;

export const query = graphql`
  query LandingPageQuery($latestReportNumber: Int, $locale: String!) {
    latestReportIncident: mongodbAiidprodIncidents(reports: { eq: $latestReportNumber }) {
      incident_id
    }
    latestReport: mongodbAiidprodReports(report_number: { eq: $latestReportNumber }) {
      title
      text
      epoch_date_submitted
      image_url
      report_number
      cloudinary_id
      language
    }
    latestReport_es: mongodbTranslationsReportsEs(report_number: { eq: $latestReportNumber }) {
      title
      text
    }
    latestReport_fr: mongodbTranslationsReportsFr(report_number: { eq: $latestReportNumber }) {
      title
      text
    }
    latestReport_en: mongodbTranslationsReportsEn(report_number: { eq: $latestReportNumber }) {
      title
      text
    }
    latestPost: allMdx(
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
