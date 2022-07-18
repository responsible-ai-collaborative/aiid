import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import UniqueSubmittersLeaderboard from 'components/leaderboards/UniqueSubmittersLeaderboard';
import OriginalSubmitersLeaderboard from 'components/leaderboards/OriginalSubmittersLeaderboard';
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';
import { Trans } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';

export default function Featured() {
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title as="h2">
            <Trans ns="landing">Incident Report Submission Leaderboards</Trans>
          </Card.Title>
          <Card.Subtitle>
            <Trans i18nKey="leaderboardDescription" ns="landing">
              These are the persons and entities credited with creating and submitted incident
              reports. More details are available on the{' '}
              <LocalizedLink to="/summaries/leaderboard">leaderboard page.</LocalizedLink>
            </Trans>
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
