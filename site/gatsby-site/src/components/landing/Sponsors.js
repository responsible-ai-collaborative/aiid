import React, { useState } from 'react';
import Link from 'components/ui/Link';
import { Trans } from 'react-i18next';

import { StyledImage, StyledImageModal, StyledImageCover } from '../../elements/StyledImage';
import { StyledSubtitle } from '../../elements/StyledTitle';
import sponsors from './sponsors.json';
import { Button, Card, Modal } from 'flowbite-react';

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
          onClose={() => setModalState('close')}
          data-cy="sponsor-modal"
        >
          <Modal.Header>
            <h5>{title}</h5>
          </Modal.Header>
          <Modal.Body>
            {children}
            <StyledImageModal src={imagePath} linkTo={linkTo} />
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button color="dark" onClick={() => setModalState('close')} data-cy="close-modal">
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default function Sponsors() {
  const [modalState, setModalState] = useState('close');

  return (
    <>
      <Card>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Trans ns="landing">The Responsible AI Collaborative</Trans>
        </h5>
        <div className="flex gap-10 flex-wrap">
          <div className="flex-1 flex gap-6 flex-col">
            <p className="italic">
              <Trans i18nKey="raicDescription" ns="landing">
                The AI Incident Database is a project of the Responsible AI Collaborative, an
                organization chartered to advance the AI Incident Database. The governance of the
                Collaborative is architected around the participation in its impact programming. For
                more details, we invite you to read the{' '}
                <a href="https://docsend.com/view/a45p7mgh44nu8x7j">founding report</a> and learn
                more on our <Link to="/about?lang=en#boardofdirectors">board and contributors</Link>
                .
              </Trans>
            </p>
            <a href="https://docsend.com/view/a45p7mgh44nu8x7j" target="_blank" rel="noreferrer">
              <StyledImageCover src="/images/reportcover.png" className="border-1" />
            </a>
          </div>
          <div className="flex justify-center items-center gap-6 flex-nowrap flex-col flex-1 min-w-[300px]">
            {sponsors.map((sponsor) => {
              return (
                <div className="flex-1 w-full" key={`sponsor-${sponsor.name}`}>
                  <Card>
                    <StyledSubtitle>
                      <Trans ns="landing">{sponsor.name}</Trans>
                    </StyledSubtitle>
                    <div className="flex flex-wrap justify-center items-center">
                      {sponsor.items.map((item) => {
                        return (
                          <div
                            key={`sponsor-item-${item.modalName}`}
                            className="h-[90px] p-3 flex-1"
                          >
                            <StyledImage
                              src={`/images/${item.logo}`}
                              onClick={() => setModalState(item.modalName)}
                              data-cy={item.dataCy ? item.dataCy : ''}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
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
    </>
  );
}
