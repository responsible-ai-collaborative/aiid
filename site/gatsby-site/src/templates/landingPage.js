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

        <Row className="mt-5">
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
          <Col lg={6} className="mt-5">
            <AboutDatabase className="border-0 shadow" />
          </Col>
          <Col lg={6} className="mt-5">
            <AboutPartnership className="border-0 shadow" />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Featured />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Leaderboards />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Blog />
          </Col>
        </Row>

        <Row>
          <Col className="mt-5" lg={6}>
            <WordCounts localWordCounts={localWordCounts} />
          </Col>
          <Col className="mt-5" lg={6}>
            <RandomReports />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default LandingPage;
