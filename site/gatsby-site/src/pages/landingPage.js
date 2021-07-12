import React, { useState } from 'react';
import Helmet from 'react-helmet';
import Layout from 'components/Layout';
import { Wordlist } from '../pages/wordcounts';
import { StyledHeading } from 'components/styles/Docs';
import styled from 'styled-components';
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';
import AuthorsLeaderboard from 'components/leaderboards/AuthorsLeaderboard';
import DomainsLeaderboard from 'components/leaderboards/DomainsLeaderboard';
import RandomIncidentsCarousel from 'components/RandomIncidentsCarousel';
import LatestIncidentReport from 'components/LatestIncidentReport';
import { navigate } from 'gatsby';
import { Link } from 'gatsby';
import { Button, InputGroup, FormControl, Container, Row, Col, Image, Card } from 'react-bootstrap';
import Blog from 'components/blog/Blog';

const StyledCard = styled(Card)`
  height: 100%;
`;

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

const StyledRow = styled(Row)`
  margin-bottom: 1em;
`;

const ImageRow = styled(StyledRow)`
  padding: 1em 2em 0em 2em;
`;

const NewsImage = styled(Image)`
  min-width: 100%;
`;

const NewsCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SectionHeading = styled(Card.Header)`
  font-size: 26px;
  font-weight: 800;
  line-height: 1.5;
  margin-bottom: 0.5em;
  background-color: rgba(0, 0, 0, 0.03);
`;

const LeaderboardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0em 2em 2em 2em;

  @media (max-width: 530px) {
    flex-direction: column;
  }
`;

const LiWrapper = styled.div`
  padding: 0em 2em 2em 2em;
  li {
    margin-left: 1em;
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
            <InputGroup.Prepend>
              <Button as={Link} to={`/apps/discover?s=${searchTerm}`} variant="outline-secondary">
                Search
              </Button>
            </InputGroup.Prepend>
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
              <Blog />
            </StyledCard>
          </Col>
        </StyledRow>
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
          <Col md={12} lg={6}>
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
          </Col>
          <Col>
            <StyledCard md={12} lg={6}>
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
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <StyledCard>
              <SectionHeading>The Database in Print</SectionHeading>
              <StyledCardLeadParagraph>
                Read about the database on the{' '}
                <a
                  href="https://www.partnershiponai.org/aiincidentdatabase/"
                  target="_blank"
                  rel="noreferrer"
                >
                  PAI Blog
                </a>
                ,{' '}
                <a
                  href="https://www.vice.com/en/article/m7agjq/this-database-is-finally-holding-ai-accountable"
                  target="_blank"
                  rel="noreferrer"
                >
                  Vice News
                </a>
                ,{' '}
                <a
                  href="https://venturebeat.com/2021/01/15/the-ai-incident-database-wants-to-improve-the-safety-of-machine-learning/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Venture Beat
                </a>
                ,{' '}
                <a
                  href="https://www.wired.com/story/artificial-intelligence-hall-shame/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wired
                </a>
                , and{' '}
                <a href="https://arxiv.org/abs/2011.08512" target="_blank" rel="noreferrer">
                  arXiv
                </a>{' '}
                among other outlets.
              </StyledCardLeadParagraph>
              <ImageRow>
                <NewsCol xs={12} sm={4}>
                  <a href="https://arxiv.org/abs/2011.08512" target="_blank" rel="noreferrer">
                    <NewsImage src="/images/news/arxiv.png" rounded />
                  </a>
                </NewsCol>
                <Col xs={12} sm={4}>
                  <a
                    href="https://venturebeat.com/2021/01/15/the-ai-incident-database-wants-to-improve-the-safety-of-machine-learning/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <NewsImage src="/images/news/VentureBeat.png" rounded />
                  </a>
                  <a
                    href="https://www.wired.com/story/artificial-intelligence-hall-shame/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <NewsImage src="/images/news/Wired_logo.svg" rounded />
                  </a>
                </Col>
                <NewsCol xs={12} sm={4}>
                  <a
                    href="https://www.vice.com/en/article/m7agjq/this-database-is-finally-holding-ai-accountable"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <NewsImage src="/images/news/vice.png" rounded />
                  </a>
                </NewsCol>
              </ImageRow>
            </StyledCard>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <StyledCard>
              <SectionHeading>Incident Report Submission Leaderboards</SectionHeading>
              <StyledCardLeadParagraph>
                These are the persons and entities credited with creating and submitted incident
                reports. More details are available on the{' '}
                <Link to="/summaries/leaderboard">leaderboard page.</Link>
              </StyledCardLeadParagraph>
              <LeaderboardContainer>
                <SubmittersLeaderboard limit={3} />
                <AuthorsLeaderboard limit={3} />
                <DomainsLeaderboard limit={3} />
              </LeaderboardContainer>
            </StyledCard>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col xs={12} sm={12} md={12} lg={6}>
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
          </Col>
          <Col xs={12} sm={12} md={12} lg={6}>
            <StyledCard>
              <SectionHeading>Random Reports</SectionHeading>
              <RandomIncidentsCarousel />
            </StyledCard>
          </Col>
        </StyledRow>
      </Container>
    </Layout>
  );
};

export default LandingPage;
