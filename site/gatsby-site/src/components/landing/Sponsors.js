import React, { useState } from 'react';
import Link from 'components/ui/Link';
import { Trans, useTranslation } from 'react-i18next';

import { StyledImage, StyledImageCover } from '../../elements/StyledImage';
import { Button, Card, Modal } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { GatsbyImage } from 'gatsby-plugin-image';
import { PrismicRichText } from '@prismicio/react';
import { useLocalization } from 'plugins/gatsby-theme-i18n';

const SponsorModal = ({ setModalState, modalState, modalName, children, title }) => {
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
          <Modal.Body>{children}</Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button color="dark" onClick={() => setModalState('close')} data-cy="close-modal">
                <Trans>Close</Trans>
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default function Sponsors({ sponsors = [] }) {
  const [modalState, setModalState] = useState('close');

  const { locale } = useLocalization();

  sponsors = sponsors.filter((sponsor) => sponsor?.node?.data?.language?.text === locale);

  const { t } = useTranslation(['sponsors']);

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
              <p className="italic">
                <Trans i18nKey="forms" ns="landing">
                  View the Responsible AI Collaborative’s{' '}
                  <a
                    href="https://drive.google.com/file/d/1mTgbaDIbvNQU8PRaz7yG_pP7ibsqNNo9/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Form 990
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://drive.google.com/file/d/1Gj0DnBKYJF2jO59MeymW8R1SCv60m6Jb/view?usp=share_link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    tax-exempt application.
                  </a>
                </Trans>
              </p>
            </span>
          </div>
          <div className="flex justify-center items-center gap-5 md:gap-6 flex-nowrap flex-col flex-1">
            {sponsors.map((sponsor) => {
              return (
                <div className="flex-1 w-full" key={`sponsor-${sponsor.node.data.title.text}`}>
                  <Card>
                    <h6 className="text-lg dark:text-white mb-0">
                      <Trans ns="landing">{t(sponsor.node.data.title.text)}</Trans>
                    </h6>
                    <div className="flex justify-around gap-4 items-center">
                      {sponsor.node.data.items.map((item) => {
                        return (
                          <div
                            key={`sponsor-item-${item.name.text}`}
                            className="flex-1 max-w-xs w-full max-h-[90px] ml-0 mr-0 text-center"
                            data-cy={`${item.name.text}-image`}
                          >
                            <StyledImage
                              src={`${item.logo.url}`}
                              onClick={() => setModalState(item.name.text)}
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
        return sponsor?.node?.data?.items.map((item) => {
          return (
            <SponsorModal
              key={`sponsor-${item.name.text}`}
              setModalState={setModalState}
              modalState={modalState}
              modalName={item.name.text}
              title={item.name.text}
            >
              <PrismicRichText field={item.description.richText} />
              <div className="flex justify-center items-center">
                <Link to={item.link.url} target="_blank">
                  <GatsbyImage
                    alt={`${item.name.text} Logo`}
                    className="img-fluid rounded-lg w-[85%] max-w-[200px] max-h-[80px]"
                    imgClassName="object-fill"
                    image={item.logo.gatsbyImageData}
                  />
                </Link>
              </div>
            </SponsorModal>
          );
        });
      })}
    </>
  );
}
