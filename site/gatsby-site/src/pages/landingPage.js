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

const Card = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  padding: 1em 2em 2em 2em;
  margin-bottom: 2em;
`;

const NoBackgroudCard = styled.div`
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
      <SectionHeading>Search for an incident</SectionHeading>
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
        <title>Welcome to the Artifical Intelligence Incident Database</title>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>Welcome to the AIID</StyledHeading>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus lacinia magna a
        rutrum. Curabitur ante ligula, elementum eget metus et, varius pharetra sapien. Donec
        ullamcorper elit commodo ipsum venenatis consequat. Nulla vitae lorem blandit, pellentesque
        mauris non, pretium dui. Nullam nulla magna, blandit id lacus vel, ultrices malesuada erat.
        Vivamus id ligula ut mi dignissim imperdiet sed vel leo. Nam dui lacus, rhoncus eu imperdiet
        eget, efficitur non nisi. Etiam pellentesque dui lacinia, facilisis tellus sed, laoreet
        ipsum. Etiam pretium et ligula ac posuere. Aliquam ut faucibus nibh, vel maximus enim.
        Aliquam congue augue sit amet risus dapibus, ut pretium enim mollis.
      </p>
      <Card>
        <SectionHeading>Latest Incident Report</SectionHeading>
        <LatestIncidentReport />
      </Card>
      <Card>
        <DiscoverAppSearch />
      </Card>
      <NoBackgroudCard>
        <RandomIncidentsCarousel />
      </NoBackgroudCard>
      <Card>
        <SectionHeading>Wordcount</SectionHeading>
        <LiWrapper>
          <Wordlist content={localWordCounts} />
        </LiWrapper>
      </Card>
      <Card>
        <SectionHeading>Incident Report Submission Leaderboards</SectionHeading>
        <LeaderboardContainer>
          <SubmittersLeaderboard limit={3} />
          <AuthorsLeaderboard limit={3} />
          <DomainsLeaderboard limit={3} />
        </LeaderboardContainer>
      </Card>
    </Layout>
  );
};

export default LandingPage;
