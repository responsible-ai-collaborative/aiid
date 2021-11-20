import React from 'react';
import { Card } from 'react-bootstrap';
import UniqueSubmittersLeaderboard from 'components/leaderboards/UniqueSubmittersLeaderboard';
import OriginalSubmitersLeaderboard from 'components/leaderboards/OriginalSubmittersLeaderboard';
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';
import styled from 'styled-components';
import { Link } from 'gatsby';

const LeaderboardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0em 2em 2em 2em;
  margin: 1rem auto 0;
  h2 {
    font-size: 1.2em;
  }

  @media (max-width: 991px) {
    flex-direction: column;
  }
`;

export default function Featured() {
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className="text-center h3">
            Incident Report Submission Leaderboards
          </Card.Title>
          <Card.Subtitle className="text-center">
            These are the persons and entities credited with creating and submitted incident
            reports. More details are available on the{' '}
            <Link to="/summaries/leaderboard">leaderboard page.</Link>
          </Card.Subtitle>
          <LeaderboardContainer>
            <OriginalSubmitersLeaderboard limit={3} />
            <UniqueSubmittersLeaderboard limit={3} />
            <SubmittersLeaderboard limit={3} />
          </LeaderboardContainer>
        </Card.Body>
      </Card>
    </>
  );
}
