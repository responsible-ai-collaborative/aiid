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
import { Button, InputGroup, FormControl } from 'react-bootstrap';

const LeadParagraph = styled.p`
  margin-bottom: 0px;
  line-height: 1.7;
`;

const Card = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  padding: 1em 2em 2em 2em;
  margin-bottom: 2em;
`;

const NoBackgroundCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 2em;
`;

const SectionHeading = styled.h1`
  font-size: 26px;
  font-weight: 800;
  line-height: 1.5;
  margin-bottom: 0.5em;
`;

const LeaderboardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 530px) {
    flex-direction: column;
  }
`;

const CarouselEntry = styled.div`
  width: 50%;
  min-height: 300px;
`;

const LiWrapper = styled.div`
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
      <Card>
        <LeadParagraph>
          The AI Incident Database is a collection of harms or near harms realized in the real world
          by the deployment of intelligent systems. You are invited to{' '}
          <Link to="/apps/quickadd">submit</Link> reports to the database, whereupon accepted
          incidents will be indexed and made <Link to="/apps/discover">discoverable</Link> to people
          developing and deploying the next generation of AI technology to the world. Artificial
          intelligence will only be a benefit to people and society if we collectively record and
          learn from its failings. Learn more <Link to="/about">about the database</Link>, or read
          about it on the{' '}
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
          , and{' '}
          <a href="https://arxiv.org/abs/2011.08512" target="_blank" rel="noreferrer">
            arXiv
          </a>{' '}
          among other outlets.
        </LeadParagraph>
      </Card>
      <Card>
        <DiscoverAppSearch />
      </Card>
      <Card>
        <SectionHeading>Latest Incident Report</SectionHeading>
        <LatestIncidentReport />
      </Card>
      <Card>
        <SectionHeading>Incident Report Submission Leaderboards</SectionHeading>
        <p>
          These are the persons and entities credited with creating and submitted incident reports.
          More details are available on the{' '}
          <Link to="/summaries/leaderboard">leaderboard page.</Link>
        </p>
        <LeaderboardContainer>
          <SubmittersLeaderboard limit={3} />
          <AuthorsLeaderboard limit={3} />
          <DomainsLeaderboard limit={3} />
        </LeaderboardContainer>
      </Card>
      <Card>
        <SectionHeading>Wordcounts</SectionHeading>
        <p>
          These are the most common rooted and stemmed words across all incident reports. More
          details are available on its <Link to="/summaries/wordcounts">data summary page.</Link>
        </p>
        <LiWrapper>
          <Wordlist content={localWordCounts} />
        </LiWrapper>
      </Card>
      <NoBackgroundCard>
        <CarouselEntry>
          <RandomIncidentsCarousel />
        </CarouselEntry>
        <CarouselEntry>
          <RandomIncidentsCarousel />
        </CarouselEntry>
      </NoBackgroundCard>
    </Layout>
  );
};

export default LandingPage;
