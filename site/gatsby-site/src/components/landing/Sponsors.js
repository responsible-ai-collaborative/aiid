import React, { useState } from 'react';
import Link from 'components/ui/Link';
import { Trans } from 'react-i18next';

import { StyledImage, StyledImageModal, StyledImageCover } from '../../elements/StyledImage';
import sponsors from './sponsors.json';
import { Button, Card, Modal } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

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
      <div className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Trans ns="landing">The Responsible AI Collaborative</Trans>
        </h5>
        <div className="flex gap-10 flex-wrap">
          <div className="flex-1 flex gap-6 flex-col">
            <span className="relative z-2 pt-8">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                className="text-gray-300 absolute -z-2 opacity-50 -top-0"
                size="5x"
              />
              <p className="italic">
                <Trans i18nKey="raicDescription" ns="landing">
                  The AI Incident Database is a project of the Responsible AI Collaborative, an
                  organization chartered to advance the AI Incident Database. The governance of the
                  Collaborative is architected around the participation in its impact programming.
                  For more details, we invite you to read the{' '}
                  <a href="https://docsend.com/view/a45p7mgh44nu8x7j">founding report</a> and learn
                  more on our{' '}
                  <Link to="/about?lang=en#boardofdirectors">board and contributors</Link>.
                </Trans>
              </p>
              <a href="https://docsend.com/view/a45p7mgh44nu8x7j" target="_blank" rel="noreferrer">
                <StyledImageCover src="/images/reportcover.png" className="border-1" />
              </a>
            </span>
          </div>
          <div className="flex justify-center items-center gap-5 md:gap-6 flex-nowrap flex-col flex-1">
            {sponsors.map((sponsor) => {
              return (
                <div className="flex-1 w-full" key={`sponsor-${sponsor.name}`}>
                  <Card>
                    <h6 className="text-lg dark:text-white mb-0">
                      <Trans ns="landing">{sponsor.name}</Trans>
                    </h6>
                    <div className="flex justify-around gap-4">
                      {sponsor.items.map((item) => {
                        return (
                          <div
                            key={`sponsor-item-${item.modalName}`}
                            className="max-w-xs w-full max-h-[90px] ml-0 mr-0 text-center"
                          >
                            <StyledImage
                              src={`/images/${item.logo}`}
                              onClick={() => setModalState(item.modalName)}
                              data-cy={item.dataCy ? item.dataCy : ''}
                              className="max-h-[90px] ml-0 mr-0 mb-0 inline-flex"
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
      </div>
      {sponsors.map((sponsor) => {
        return sponsor.items.map((item) => {
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
        });
      })}
    </>
  );
}
