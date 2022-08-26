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
import Row from '../elements/Row';
import Col from '../elements/Col';

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
        <Row>
          <Col>
            <Hero />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col>
            <QuickSearch className="text-center border-0" />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <LatestReports latestReport={latestReport} />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <QuickAdd />
          </Col>
        </Row>

        <Row>
          <Col
            className="mt-4 md:flex-0-0-auto md:w-full 992px:flex-0-0-auto 992px:w-2/4"
            sm={12}
            md={12}
            lg={6}
          >
            <AboutDatabase className="h-full" />
          </Col>
          <Col
            className="mt-4 md:flex-0-0-auto md:w-full 992px:flex-0-0-auto 992px:w-2/4"
            sm={12}
            md={12}
            lg={6}
          >
            <Blog />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Featured />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Leaderboards />
          </Col>
        </Row>

        <Row>
          <Col className="p-3 " md={12} lg={6}>
            <WordCounts localWordCounts={localWordCounts} />
          </Col>
          <Col className="p-3" md={12} lg={6}>
            <RandomReports />
          </Col>
        </Row>

        <Row>
          <Col md={12} lg={12}>
            <Sponsors className="h-full" />
          </Col>
        </Row>
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
