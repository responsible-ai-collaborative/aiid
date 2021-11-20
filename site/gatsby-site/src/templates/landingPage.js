import React, { useState } from 'react';
import Helmet from 'react-helmet';
import Layout from 'components/Layout';
import Wordlist from 'components/WordList';
import { StyledHeading } from 'components/styles/Docs';
import styled from 'styled-components';

import RandomIncidentsCarousel from 'components/RandomIncidentsCarousel';
import LatestIncidentReport from 'components/LatestIncidentReport';
import { navigate } from 'gatsby';
import { Link } from 'gatsby';
import { Button, InputGroup, FormControl, Container, Row, Col, Card } from 'react-bootstrap';
import LatestPost from 'components/blog/LatestPost';
import QuickAddForm from 'components/forms/QuickAddForm';

import Featured from 'components/landing/Featured';
import Leaderboards from 'components/landing/Leaderboards';

const StyledCard = styled(Card)``;

const StyledLeadContent = styled.div`
  padding: 0em 2em 0em 2em;
  margin-bottom: 0px;
  line-height: 1.7;
`;

const StyledCardLeadParagraph = styled.p`
  padding: 0em 2em 0em 2em;
  margin-bottom: 0px;
  line-height: 1.7;
`;

const StyledCardParagraph = styled.p`
  padding: 1em 2em 2em 2em;
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

const LiWrapper = styled.div`
  padding: 0em 2em 2em 2em;
  li {
    margin-left: 1em;
  }
`;

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
            <StyledCard>
              <SectionHeading>About the Database</SectionHeading>
              <StyledCardLeadParagraph>
                The AI Incident Database is the only collection of AI deployment harms or near harms
                across all disciplines, geographies, and use cases.
              </StyledCardLeadParagraph>
              <StyledCardParagraph>
                You are invited to <Link to="/apps/quickadd">submit</Link> reports to the database,
                whereupon accepted incidents will be indexed and made{' '}
                <Link to="/apps/discover">discoverable</Link> to people developing and deploying the
                next generation of AI technology to the world. Artificial intelligence will only be
                a benefit to people and society if we collectively record and learn from its
                failings. <Link to={`/about`}>(Learn More)</Link>
              </StyledCardParagraph>
            </StyledCard>
          </StyledCol>
          <StyledCol lg={6}>
            <StyledCard>
              <SectionHeading>About Partnership on AI</SectionHeading>
              <StyledCardLeadParagraph>
                The <a href="http://partnershiponai.org/">Partnership on AI</a> is the leading forum
                addressing the most important and difficult decisions on the future of AI. We are a
                non-profit that invites diverse voices into the process of technical governance,
                design, and deployment of AI technologies. Partners work together across industry,
                academia, and civil society to understand the implications of AI advancements and
                ensure they benefit society equitably.
              </StyledCardLeadParagraph>
              <StyledCardParagraph>
                The AI Incident Database is one of PAI’s key projects because it is a tangible
                resource on what can happen if AI is not built or deployed in a manner which
                considers real world implications.{' '}
                <Link to={`/about/1-governance`}>(Learn More)</Link>
              </StyledCardParagraph>
            </StyledCard>
          </StyledCol>
        </StyledRow>

        <Featured />

        <Leaderboards />

        <StyledRow>
          <Col>
            <StyledCard>
              <SectionHeading>Latest Blog Post</SectionHeading>
              <LatestPost />
            </StyledCard>
          </Col>
        </StyledRow>
        <StyledRow>
          <StyledCol lg={6}>
            <StyledCard>
              <SectionHeading>Wordcounts</SectionHeading>
              <StyledCardLeadParagraph>
                These are the most common rooted and stemmed words across all incident reports. More
                details are available on its{' '}
                <Link to="/summaries/wordcounts">data summary page.</Link>
              </StyledCardLeadParagraph>
              <LiWrapper>
                <Wordlist content={localWordCounts} />
              </LiWrapper>
            </StyledCard>
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
