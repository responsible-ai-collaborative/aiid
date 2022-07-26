import { Link } from 'gatsby';
import React from 'react';
import { Card } from 'react-bootstrap';

export default function AboutDatabase({ className }) {
  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title as="h2">About the Database</Card.Title>
        <Card.Text className="fst-italic">
          The AI Incident Database is dedicated to indexing the collective history of harms or near
          harms realized in the real world by the deployment of artificial intelligence systems.
          Like similar databases in aviation and computer security, the AI Incident Database aims to
          learn from experience so we can prevent or mitigate bad outcomes.
        </Card.Text>
        <Card.Text className="fst-italic">
          You are invited to <Link to="/apps/submit">submit</Link> incident reports, whereupon
          submissions will be indexed and made <Link to="/apps/discover">discoverable</Link> to the
          world. Artificial intelligence will only be a benefit to people and society if we
          collectively record and learn from its failings. <Link to={`/about`}>(Learn More)</Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
