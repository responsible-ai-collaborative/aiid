import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
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
import { useLocalization } from 'gatsby-theme-i18n';
import Container from '../elements/Container';

const LandingPage = (props) => {
  const {
    pageContext: { wordCountsSorted },
    data,
  } = props;

  const localWordCounts = wordCountsSorted.filter((word, index) => index < 10);

  const { latestReport, latestReportIncident } = data;

  latestReport.incident_id = latestReportIncident.incident_id;

  const { locale: language } = useLocalization();

  if (latestReport.language !== language) {
    const translation = data[`latestReport_${language}`];

    latestReport.title = translation.title;
    latestReport.text = translation.text;
  }

  const { t } = useTranslation(['translation', 'landing']);

  const title = t('Welcome to the Artificial Intelligence Incident Database', { ns: 'landing' });

  const metaDescription = t('The starting point for information about the AI Incident Database', {
    ns: 'landing',
  });

  return (
    <Layout {...props}>
      <AiidHelmet>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={metaDescription} />
      </AiidHelmet>
      <Container>
        <div className="mb-10">
          <Hero />
        </div>

        <div className="mb-10">
          <QuickSearch />
        </div>

        <div className="mb-10">
          <div>
            <LatestReports latestReport={latestReport} />
          </div>
        </div>

        <div className="mb-10">
          <div className="flex flex-col items-center">
            <QuickAdd />
          </div>
        </div>

        <div className="flex flex-row gap-10 mb-10 flex-wrap">
          <div className="flex-1 lg:max-w-[50%]">
            <AboutDatabase />
          </div>
          <div className="flex-1 lg:max-w-[50%]">
            <Blog />
          </div>
        </div>

        <div className="mb-10">
          <div>
            <Featured />
          </div>
        </div>

        <div className="mb-10">
          <div>
            <Leaderboards />
          </div>
        </div>

        <div className="mb-10 flex flex-row gap-10 flex-wrap">
          <div className="flex-1 lg:max-w-[50%]">
            <WordCounts localWordCounts={localWordCounts} />
          </div>
          <div className="flex-1 lg:max-w-[50%]">
            <RandomReports />
          </div>
        </div>

        <div>
          <div md={12} lg={12}>
            <Sponsors />
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default LandingPage;

export const query = graphql`
  query LandingPageQuery($latestReportNumber: Int) {
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

    latestReport_en: mongodbTranslationsReportsEn(report_number: { eq: $latestReportNumber }) {
      title
      text
    }
  }
`;
