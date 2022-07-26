import React from 'react';
import Helmet from 'react-helmet';
import Layout from 'components/Layout';
import { Container, Row, Col } from 'react-bootstrap';
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

const LandingPage = (props) => {
  const {
    pageContext: { wordCountsSorted },
  } = props;

  const localWordCounts = wordCountsSorted.filter((word, index) => index < 10);

  const { t } = useTranslation(['translation', 'landing']);

  const title = t('Welcome to the Artificial Intelligence Incident Database', { ns: 'landing' });

  const metaDescription = t('The starting point for information about the AI Incident Database', {
    ns: 'landing',
  });

  return (
    <Layout {...props}>
      <Helmet>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={metaDescription} />
      </Helmet>
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
            <LatestReports />
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <QuickAdd />
          </Col>
        </Row>

        <Row>
          <Col className="mt-4" sm={12} md={12} lg={6}>
            <AboutDatabase className="h-100" />
          </Col>
          <Col className="mt-4" sm={12} md={12} lg={6}>
            <Blog className="h-100" />
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
          <Col className="mt-4" md={12} lg={6}>
            <WordCounts localWordCounts={localWordCounts} />
          </Col>
          <Col className="mt-4" md={12} lg={6}>
            <RandomReports />
          </Col>
        </Row>

        <Row>
          <Col className="mt-4" md={12} lg={12}>
            <Sponsors className="h-100" />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default LandingPage;
