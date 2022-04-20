import React from 'react';
import Helmet from 'react-helmet';
import Layout from 'components/Layout';
import { Container, Row, Col } from 'react-bootstrap';
import Featured from 'components/landing/Featured';
import Leaderboards from 'components/landing/Leaderboards';
import Blog from 'components/landing/Blog';
import WordCounts from 'components/landing/WordCounts';
import AboutPartnership from 'components/landing/AboutPartnership';
import AboutDatabase from 'components/landing/AboutDatabase ';
import LatestReports from 'components/landing/LatestReports';
import QuickSearch from 'components/landing/QuickSearch';
import QuickAdd from 'components/landing/QuickAdd';
import RandomReports from 'components/landing/RandomReports';
import Founding from 'components/landing/Founding';
import Hero from 'components/landing/Hero';

const LandingPage = (props) => {
  const {
    pageContext: { wordCountsSorted },
  } = props;

  const localWordCounts = wordCountsSorted.filter((word, index) => index < 10);

  const metaTitle = 'Welcome to the Artificial Intelligence Incident Database';

  const metaDescription = 'The starting point for information about the AI Incident Database';

  return (
    <Layout {...props}>
      <Helmet>
        <title>Welcome to the Artificial Intelligence Incident Database</title>
        <meta name="title" content={metaTitle} />
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
            <QuickSearch className="text-center border-0 px-5" />
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

        <Row>
          <Col className="mt-4" md={12} lg={6}>
            <Founding className="h-100" />
          </Col>
          <Col className="mt-4" md={12} lg={6}>
            <AboutPartnership className="h-100" />
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
      </Container>
    </Layout>
  );
};

export default LandingPage;
