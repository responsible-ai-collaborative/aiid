import React, { useState } from 'react';
import Helmet from 'react-helmet';
import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import styled from 'styled-components';

import RandomIncidentsCarousel from 'components/RandomIncidentsCarousel';
import LatestIncidentReport from 'components/LatestIncidentReport';
import { navigate } from 'gatsby';
import { Link } from 'gatsby';
import { Button, InputGroup, FormControl, Container, Row, Col, Card } from 'react-bootstrap';
import QuickAddForm from 'components/forms/QuickAddForm';
import Featured from 'components/landing/Featured';
import Leaderboards from 'components/landing/Leaderboards';
import Blog from 'components/landing/Blog';
import WordCounts from 'components/landing/WordCounts';
import AboutPartnership from 'components/landing/AboutPartnership';
import AboutDatabase from 'components/landing/AboutDatabase ';

const StyledCard = styled(Card)``;

const StyledLeadContent = styled.div`
  padding: 0em 2em 0em 2em;
  margin-bottom: 0px;
  line-height: 1.7;
`;

const StyledRow = styled(Row)``;

const StyledCol = styled(Col)`
  @media (max-width: 991px) {
    &.col-lg-6 + &.col-lg-6 {
      margin-top: 1rem;
    }
  }
`;

const SectionHeading = styled(Card.Header)``;

const StyledQuickAddForm = styled(QuickAddForm)`
  margin-top: -1rem;
  form {
    background: #fff;
    padding: 1rem 2rem 2rem !important;
  }
  label {
    display: none;
  }
  .form-group {
    margin-bottom: 0;
  }
  .error-message {
    position: relative;
  }
  p {
    display: none;
  }
`;

const DiscoverAppSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate(`/apps/discover?s=${searchTerm}`);
  };

  return (
    <>
      <SectionHeading>Search all incident reports</SectionHeading>
      <StyledLeadContent>
        <form onSubmit={submit}>
          <InputGroup className="mb-3">
            <Button as={Link} to={`/apps/discover?s=${searchTerm}`} variant="outline-secondary">
              Search
            </Button>
            <FormControl
              id="algolia-search"
              aria-describedby="basic-addon1"
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
            />
          </InputGroup>
        </form>
        <label className="alert-light" htmlFor="algolia-search">
          Entering text above will search across more than 1200 incident reports
        </label>
      </StyledLeadContent>
    </>
  );
};

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
            <StyledCard>
              <DiscoverAppSearch />
            </StyledCard>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <StyledCard>
              <SectionHeading>Latest Incident Report</SectionHeading>
              <LatestIncidentReport />
            </StyledCard>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <StyledCard>
              <SectionHeading>Quick Add New Report URL</SectionHeading>
              <StyledQuickAddForm showDescription={false} appendSubmit={true} />
            </StyledCard>
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
            <StyledCard>
              <SectionHeading>Random Reports</SectionHeading>
              <RandomIncidentsCarousel />
            </StyledCard>
          </StyledCol>
        </StyledRow>
      </Container>
    </Layout>
  );
};

export default LandingPage;
