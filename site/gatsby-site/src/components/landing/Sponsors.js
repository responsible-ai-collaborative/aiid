import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import Link from 'components/ui/Link';
import { Button, Modal } from 'react-bootstrap';
import wu_foundation_blue_logo from './assets/wu-foundation-blue-logo.svg';
import netlify_dark from './assets/netlify-dark.svg';
import cloudinary_cloud_glyph_regular from './assets/cloudinary_cloud_glyph_regular.svg';
import partership_on_ai_logo from './assets/partership-on-ai-logo.png';
import { Trans } from 'react-i18next';

const StyledImageModal = styled.img`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-around;
  align-items: center;
  width: 85%;
  max-width: 355px;
  max-height: 80px;
`;

const StyledImage = styled.img`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  justify-content: space-around;
  align-items: center;
  width: 85%;
  max-width: 355px;
  max-height: 80px;
  cursor: zoom-in;
`;

const StyledImageCover = styled.img`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
  justify-content: space-around;
  align-items: center;
  max-width: 220px;
  border: 1px solid black;
`;

const StyledSubtitle = styled(Card.Subtitle).attrs((props) => ({
  top: props.top || '30px',
  bottom: props.bottom || '30px',
  margin: props.margin || '-.25rem',
}))`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-around;
  padding-top: ${(props) => props.top};
  padding-bottom: ${(props) => props.bottom};
  margin-top: ${(props) => props.margin} !important;
`;

const SponsorModal = ({ setModalState, modalState, modalName, children, imagePath, title }) => {
  return (
    <Modal
      show={modalState === modalName}
      onHide={() => setModalState('close')}
      data-cy="sponsor-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
        <StyledImageModal src={imagePath} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setModalState('close')} data-cy="close-modal">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default function Sponsors({ className }) {
  const [modalState, setModalState] = useState('close');

  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">The Responsible AI Collaborative</Trans>
        </Card.Title>
        <Row className="g-0">
          <Col lg={5} md={12} sm={12}>
            <Card.Text className="fst-italic">
              <Trans i18nKey="raicDescription" ns="landing">
                The AI Incident Database is a project of the Responsible AI Collaborative, an
                organization chartered to advance the AI Incident Database. The governance of the
                Collaborative is architected around the participation in its impact programming. For
                more details, we invite you to read the{' '}
                <a href="https://docsend.com/view/a45p7mgh44nu8x7j">founding report</a> and learn
                more on our <Link to="/about?lang=en#boardofdirectors">board and contributors</Link>
                .
              </Trans>
            </Card.Text>
            <a href="https://docsend.com/view/a45p7mgh44nu8x7j" target="_blank" rel="noreferrer">
              <StyledImageCover src="/images/reportcover.png" />
            </a>
          </Col>
          <Col lg={6} md={12} sm={12} className="offset-lg-1">
            <StyledSubtitle top={'0px'} margin={'0px'}>
              <Trans ns="landing">Organization Founding Sponsor</Trans>
            </StyledSubtitle>

            <Card.Text>
              <StyledImage
                src={wu_foundation_blue_logo}
                onClick={() => setModalState('WU')}
                data-cy="wu-modal-click"
              />
            </Card.Text>

            <StyledSubtitle>
              <Trans ns="landing">Database Founding Sponsor</Trans>
            </StyledSubtitle>

            <Card.Text>
              <StyledImage src={partership_on_ai_logo} onClick={() => setModalState('PAI')} />
            </Card.Text>
            <StyledSubtitle>
              <Trans ns="landing">In-Kind Sponsors</Trans>
            </StyledSubtitle>
            <Row className="g-0">
              <Col sm={6}>
                <StyledImage src={netlify_dark} onClick={() => setModalState('N')} />
              </Col>
              <Col sm={6}>
                <StyledImage
                  src={cloudinary_cloud_glyph_regular}
                  onClick={() => setModalState('CLOUDINARY')}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <SponsorModal
          setModalState={setModalState}
          modalState={modalState}
          modalName={'PAI'}
          title={'Partnership on AI'}
          imagePath={partership_on_ai_logo}
        >
          <p>
            As a{' '}
            <a
              href="https://partnershiponai.org/resource/tracking-when-ai-systems-fail/"
              target="_blank"
              rel="noreferrer"
            >
              founding sponsor
            </a>{' '}
            of the AI Incident Database (AIID), Partnership on AI supported the start-up of the
            database, including a grant to support the project prior to the founding of the
            Responsible AI Collaborative. Partnership on AI also invested in promoting the social
            benefits of the AIID to their Partners and other stakeholders and have an ongoing
            interest in supporting its outcomes.
          </p>
        </SponsorModal>

        <SponsorModal
          setModalState={setModalState}
          modalState={modalState}
          modalName={'N'}
          title={'Netlify'}
          imagePath={netlify_dark}
        >
          <p>
            <a href="https://www.netlify.com/" target="_blank" rel="noreferrer">
              Netlify
            </a>{' '}
            provides the Responsible AI Collaborative with free hosting, build minutes, and accounts
            for the open source development of the AI Incident Database.
          </p>
        </SponsorModal>

        <SponsorModal
          setModalState={setModalState}
          modalState={modalState}
          modalName={'WU'}
          title={'Waking Up Foundation'}
          imagePath={wu_foundation_blue_logo}
        >
          <p>
            On the recommendation of Longview Philanthropy, the{' '}
            <a href="https://www.wakingup.com/foundation" target="_blank" rel="noreferrer">
              Waking Up Foundation
            </a>{' '}
            contributed a founding grant of $550k USD directed to the AI Incident Database. $33k of
            the total is committed to our fiscal sponsor for running the books and tax compliance
            for the organization. Approximately $5k is dedicated to maintaining the RAIC non-profit
            entity that directs the AIID programming sponsored by a fiscal sponsor. The remaining
            funds are all dedicated to programmatic outputs, including staff time for programming
            and research.
          </p>
        </SponsorModal>

        <SponsorModal
          setModalState={setModalState}
          modalState={modalState}
          modalName={'CLOUDINARY'}
          title={'Cloudinary'}
          imagePath={cloudinary_cloud_glyph_regular}
        >
          <p>
            <a href="https://cloudinary.com/" target="_blank" rel="noreferrer">
              Cloudinary
            </a>{' '}
            provides discounted image and video hosting on their cloud hosting service. They are the
            reason so many images load quickly across the database.
          </p>
        </SponsorModal>
      </Card.Body>
    </Card>
  );
}
