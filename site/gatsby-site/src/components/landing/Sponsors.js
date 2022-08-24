import React, { useState } from 'react';
import Link from 'components/ui/Link';
import wu_foundation_blue_logo from './assets/wu-foundation-blue-logo.svg';
import netlify_dark from './assets/netlify-dark.svg';
import cloudinary_cloud_glyph_regular from './assets/cloudinary_cloud_glyph_regular.svg';
import partership_on_ai_logo from './assets/partership-on-ai-logo.png';
import algolia_logo from './assets/Algolia-nebula.svg';
import { Trans } from 'react-i18next';
import Card from '../../elements/Card';
import Col from '../../elements/Col';
import Row from '../../elements/Row';
import Button from '../../elements/Button';

import { StyledImage, StyledImageModal, StyledImageCover } from '../../elements/StyledImage';
import { StyledSubtitle } from '../../elements/StyledTitle';
import { Modal } from 'react-bootstrap';
import sponsors from './sponsors.json';

const SponsorModal = ({
  setModalState,
  modalState,
  modalName,
  children,
  imagePath,
  title,
  linkTo,
}) => {
  return (
    <>
      {modalState === modalName && (
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
            <StyledImageModal src={imagePath} linkTo={linkTo} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalState('close')}
              data-cy="close-modal"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
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
            <div className="tw-border tw-border-border-gray tw-rounded-lg tw-mb-3 tw-p-1">
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
            </div>

            <div className="tw-border tw-border-border-gray tw-rounded-lg tw-mb-3 tw-p-1">
              <StyledSubtitle>
                <Trans ns="landing">Database Founding Sponsor</Trans>
              </StyledSubtitle>

              <Card.Text>
                <StyledImage src={partership_on_ai_logo} onClick={() => setModalState('PAI')} />
              </Card.Text>
            </div>

            <div className="tw-border tw-border-border-gray tw-rounded-lg tw-mb-3 tw-p-1">
              <StyledSubtitle>
                <Trans ns="landing">In-Kind Sponsors</Trans>
              </StyledSubtitle>
              <Row className="g-0 tw-items-center tw-gap-2 tw-justify-between">
                <Col sm={6}>
                  <StyledImage src={netlify_dark} onClick={() => setModalState('N')} />
                </Col>
                <Col sm={6}>
                  <StyledImage
                    src={cloudinary_cloud_glyph_regular}
                    onClick={() => setModalState('CLOUDINARY')}
                  />
                </Col>
                <Col sm={6}>
                  <StyledImage
                    src={algolia_logo}
                    onClick={() => setModalState('ALGOLIA')}
                    className=""
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {sponsors.map((sponsor) => {
          return (
            <>
              {sponsor.items.map((item) => {
                const text = item.text.replace(
                  /\[\[((.*?))\]\]/g,
                  `<a href="${item.link}" target="_blank" rel="noreferrer">$1</a>`
                );

                return (
                  <SponsorModal
                    key={`sponsor-${item.name}`}
                    setModalState={setModalState}
                    modalState={modalState}
                    modalName={item.modalName}
                    title={item.name}
                    imagePath={`/images/${item.logo}`}
                    linkTo={item.link}
                  >
                    <p dangerouslySetInnerHTML={{ __html: text }} />
                  </SponsorModal>
                );
              })}
            </>
          );
        })}
      </Card.Body>
    </Card>
  );
}
