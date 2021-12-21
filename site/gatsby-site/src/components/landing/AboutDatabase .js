import { Link } from 'gatsby';
import React from 'react';
import { Card } from 'react-bootstrap';

export default function AboutDatabase({ className }) {
  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title as="h2">About the Database</Card.Title>
        <Card.Text className="fst-italic">
          The AI Incident Database is the only collection of AI deployment harms or near harms
          across all disciplines, geographies, and use cases.
        </Card.Text>
        <Card.Text className="fst-italic">
          You are invited to <Link to="/apps/submit">submit</Link> reports to the database,
          whereupon accepted incidents will be indexed and made{' '}
          <Link to="/apps/discover">discoverable</Link> to people developing and deploying the next
          generation of AI technology to the world. Artificial intelligence will only be a benefit
          to people and society if we collectively record and learn from its failings.{' '}
          <Link to={`/about`}>(Learn More)</Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
