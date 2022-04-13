import React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';
import Link from 'components/ui/Link';
import { Row, Col } from 'react-bootstrap';

const StyledImage = styled.img`
  max-width: 150px;
  border: 1px solid black;
`;

const StyledImageMidsize = styled.img`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-around;
  align-items: center;
  width: 75%;
  max-width: 110px;
  border: 1px solid black;
`;

const HideOnMidsize = styled.div`
  @media (min-width: 992px) and (max-width: 1340px) {
    display: none;
  }
`;

const ShowOnMidsize = styled.div`
  @media (max-width: 992px) {
    display: none;
  }
  @media (min-width: 1340px) {
    display: none;
  }
  @media (min-width: 992px) and (max-width: 1340px) {
    display: inherit;
  }
`;

export default function Founding({ className }) {
  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title as="h2">Founding Report</Card.Title>
        <Row>
          <Col className="mt-0" sm={12} md={12} lg={12}>
            <HideOnMidsize>
              <a href="https://docsend.com/view/a45p7mgh44nu8x7j" target="_blank" rel="noreferrer">
                <StyledImage src="/images/reportcover.png" className="float-end ms-3" />
              </a>
            </HideOnMidsize>
            <Card.Text className="fst-italic">
              The AI Incident Database is a project of the Responsible AI Collaborative, an
              organization chartered to advance the AI Incident Database. The governance of the
              Collaborative is architected around the participants in AI Incident Database
              programming. For more details, we invite you to read the{' '}
              <a href="https://docsend.com/view/a45p7mgh44nu8x7j">founding report</a> and learn more
              on our <Link to="/about?lang=en#boardofdirectors">board and contributors</Link>.
            </Card.Text>
            <ShowOnMidsize>
              <StyledImageMidsize src="/images/reportcover.png" />
            </ShowOnMidsize>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
