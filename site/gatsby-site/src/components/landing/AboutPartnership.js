import React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const HideOnDesktop = styled.div`
  @media (min-width: 767px) {
    display: none;
  }
`;

const StyledImageMobile = styled.img`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-around;
  align-items: center;
  width: 75%;
  max-width: 110px;
`;

const StyledImage = styled.img`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-around;
  align-items: center;
  width: 85%;
  max-width: 355px;
`;

export default function AboutPartnership({ className }) {
  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title as="h2">Founding Sponsor</Card.Title>
        <Card.Text className="fst-italic">
          As a founding sponsor of the AIID,{' '}
          <a href="http://partnershiponai.org/">Partnership on AI</a> was instrumental in supporting
          the start-up of the database, as well as providing ongoing support and guidance.
          Partnership on AI also invested in promoting the social benefits of the AIID to their
          Partners and other stakeholders and have an ongoing interest in supporting its outcomes.
        </Card.Text>
        <a
          href="https://partnershiponai.org/resource/tracking-when-ai-systems-fail/"
          target="_blank"
          rel="noreferrer"
        >
          <StyledImage src="/partership-on-ai-logo.png" className="hiddenMobile" />
          <HideOnDesktop>
            <StyledImageMobile src="/partership-on-ai-logo-mobile.png" />
          </HideOnDesktop>
        </a>
      </Card.Body>
    </Card>
  );
}
