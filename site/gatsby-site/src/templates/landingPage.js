import React from 'react';
import Helmet from 'react-helmet';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import styled from 'styled-components';
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

const StyledRow = styled(Row)``;

const StyledCol = styled(Col)`
  @media (max-width: 991px) {
    &.col-lg-6 + &.col-lg-6 {
      margin-top: 1rem;
    }
  }
`;

const LandingPage = (props) => {
  const {
    pageContext: { wordCountsSorted },
  } = props;

  if (!wordCountsSorted) {
    return null;
  }

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
      <div className={'titleWrapper'}>
        <StyledHeading>Welcome to the Artificial Intelligence Incident Database</StyledHeading>
      </div>
      <Container>
        <StyledRow>
          <Col>
            <QuickSearch />
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <LatestReports />
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <QuickAdd />
          </Col>
        </StyledRow>
        <StyledRow>
          <StyledCol lg={6}>
            <AboutDatabase />
          </StyledCol>
          <StyledCol lg={6}>
            <AboutPartnership />
          </StyledCol>
        </StyledRow>

        <Featured />

        <Leaderboards />

        <Blog />

        <StyledRow>
          <StyledCol lg={6}>
            <WordCounts localWordCounts={localWordCounts} />
          </StyledCol>
          <StyledCol lg={6}>
            <RandomReports />
          </StyledCol>
        </StyledRow>
      </Container>
    </Layout>
  );
};

export default LandingPage;
