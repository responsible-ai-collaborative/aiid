import React from 'react';
import { Card } from 'react-bootstrap';

export default function AboutPartnership({ className }) {
  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title as="h2">Sponsors</Card.Title>
        <Card.Text className="fst-italic">
          As a Founding Sponsor of the AIID,{' '}
          <a href="http://partnershiponai.org/">Partnership on AI</a> was instrumental in supporting
          the start-up of the database, as well as providing ongoing support and guidance.
          Partnership on AI also invested in promoting the social benefits of the AIID to their
          Partners and other stakeholders and have an ongoing interest in supporting its outcomes.
        </Card.Text>
        <Card.Text className="fst-italic">
          Learn more about Partnership on AI{' '}
          <a href="https://partnershiponai.org/resource/tracking-when-ai-systems-fail/">
            work on incidents
          </a>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
