import { Link } from 'gatsby';
import React from 'react';
import { Card } from 'react-bootstrap';

export default function AboutPartnership({ className }) {
  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title as="h2">About Partnership on AI</Card.Title>
        <Card.Text className="fst-italic">
          The <a href="http://partnershiponai.org/">Partnership on AI</a> is the leading forum
          addressing the most important and difficult decisions on the future of AI. We are a
          non-profit that invites diverse voices into the process of technical governance, design,
          and deployment of AI technologies. Partners work together across industry, academia, and
          civil society to understand the implications of AI advancements and ensure they benefit
          society equitably.
        </Card.Text>
        <Card.Text className="fst-italic">
          The AI Incident Database is one of PAI’s key projects because it is a tangible resource on
          what can happen if AI is not built or deployed in a manner which considers real world
          implications. <Link to={`/about/1-governance`}>(Learn More)</Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
