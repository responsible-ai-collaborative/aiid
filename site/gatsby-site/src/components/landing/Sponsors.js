import React, { useState } from 'react';
import Link from 'components/ui/Link';
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
    <Card className={className + ' bootstrap'}>
      <Card.Body>
        <Card.Title as="h2">
          <Trans ns="landing">The Responsible AI Collaborative</Trans>
        </Card.Title>
        <Row className="g-0 gap-4">
          <Col lg={5} md={12} sm={12} className="p-3">
            <Card.Text className="italic">
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
              <StyledImageCover src="/images/reportcover.png" className="border-1" />
            </a>
          </Col>
          <Col lg={6} md={12} sm={12} className="flex justify-between flex-col gap-2 px-0">
            {sponsors.map((sponsor) => {
              return (
                <>
                  <div className="border-1 border-border-gray rounded-lg  p-1">
                    <StyledSubtitle>
                      <Trans ns="landing">{sponsor.name}</Trans>
                    </StyledSubtitle>
                    <div className="flex flex-wrap justify-center items-center">
                      {sponsor.items.map((item) => {
                        return (
                          <div key={`sponsor-item-${item.modalName}`} className="h-[90px] p-3">
                            <StyledImage
                              src={`/images/${item.logo}`}
                              onClick={() => setModalState(item.modalName)}
                              data-cy={item.dataCy ? item.dataCy : ''}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })}
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
