import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import UniqueSubmittersLeaderboard from 'components/leaderboards/UniqueSubmittersLeaderboard';
import OriginalSubmitersLeaderboard from 'components/leaderboards/OriginalSubmittersLeaderboard';
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';
import { Link } from 'gatsby';

export default function Featured() {
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title as="h2">Incident Report Submission Leaderboards</Card.Title>
          <Card.Subtitle>
            These are the persons and entities credited with creating and submitted incident
            reports. More details are available on the{' '}
            <Link to="/summaries/leaderboard">leaderboard page.</Link>
          </Card.Subtitle>
          <Row>
            <Col lg className="mt-4">
              <OriginalSubmitersLeaderboard limit={3} />
            </Col>
            <Col lg className="mt-4">
              <UniqueSubmittersLeaderboard limit={3} />
            </Col>
            <Col lg className="mt-4">
              <SubmittersLeaderboard limit={3} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
