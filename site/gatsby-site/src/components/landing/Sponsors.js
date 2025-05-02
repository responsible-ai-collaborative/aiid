import React, { useState } from 'react';
import Link from 'components/ui/Link';
import { Trans, useTranslation } from 'react-i18next';

import { StyledImage, StyledImageCover, StyledImageModal } from '../../elements/StyledImage';
import { Button, Card, Modal } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { GatsbyImage } from 'gatsby-plugin-image';
import { PrismicRichText } from '@prismicio/react';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import sponsorsJson from './sponsors.json';
import ReactMarkdown from 'react-markdown';

const SponsorModal = ({ setModalState, modalState, modalName, children, title, logo, linkTo }) => {
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
            {logo.gatsbyImageData ? (
              <div className="flex justify-center items-center mt-2">
                <Link to={linkTo} target="_blank">
                  <GatsbyImage
                    alt={`${title} Logo`}
                    className="img-fluid rounded-lg w-[85%] max-w-[200px] max-h-[80px]"
                    imgClassName="object-fill"
                    image={logo.gatsbyImageData}
                  />
                </Link>
              </div>
            ) : (
              <div className="mt-2">
                <StyledImageModal src={`/images/${logo}`} linkTo={linkTo} />
              </div>
            )}
          </Modal.Body>
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

  const { t } = useTranslation(['sponsors']);

  sponsors = sponsors
    .filter((sponsor) => sponsor?.node?.data?.language?.text === locale)
    .map((sponsor) => {
      return {
        name: sponsor.node.data?.title?.text,
        items: sponsor.node.data?.items?.map((item) => {
          return {
            name: item.name?.text,
            richText: item.description?.richText,
            logo: item.logo,
            link: item.link.url,
          };
        }),
      };
    });

  if (sponsors.length <= 0) {
    sponsors = sponsorsJson;
  }

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
                  <a href="https://asset.cloudinary.com/pai/cf01cce1af65f5fbb3d71fa092d001db">
                    founding report
                  </a>{' '}
                  and learn more on our{' '}
                  <Link to="/about?lang=en#boardofdirectors">board and contributors</Link>.
                </Trans>
              </p>
              <a
                href="https://asset.cloudinary.com/pai/cf01cce1af65f5fbb3d71fa092d001db"
                target="_blank"
                rel="noreferrer"
              >
                <StyledImageCover src="/images/reportcover.png" className="border-1" />
              </a>
              <p className="italic">
                <Trans ns="landing">
                  View the Responsible AI Collaborative&apos;s{' '}
                  <a
                    href="https://res.cloudinary.com/pai/image/upload/v1744386442/2024_Tax_Return_Documents_RESPONSIBLE_AI_COLLABORATIVE_INC_wpw5hb.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Form 990
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://res.cloudinary.com/pai/image/upload/v1694177781/Form_1023_-_Application_-_Responsible_AI_Collaborative_-_EIN_88-1046583_qnfgfb.pdf"
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
                <div className="flex-1 w-full" key={`sponsor-${sponsor.name}`}>
                  <Card>
                    <h6 className="text-lg dark:text-white mb-0">
                      <Trans ns="landing">{t(sponsor.name)}</Trans>
                    </h6>
                    <div className="flex justify-around gap-4 items-center">
                      {sponsor.items.map((item) => {
                        return (
                          <div
                            key={`sponsor-item-${item.name}`}
                            className="flex-1 max-w-xs w-full max-h-[90px] ml-0 mr-0 text-center"
                            data-cy={`${item.name}-image`}
                          >
                            <StyledImage
                              src={`${item.logo?.url ? item.logo.url : '/images/' + item.logo}`}
                              onClick={() => setModalState(item.name)}
                              data-cy={`${item.name}-modal-click`}
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
        return sponsor?.items.map((item) => {
          const translatedText = t(`sponsor-${item.name}`);

          return (
            <SponsorModal
              key={`sponsor-${item.name}`}
              setModalState={setModalState}
              modalState={modalState}
              modalName={item.name}
              title={item.name}
              logo={item.logo}
              linkTo={item.link}
            >
              {item.richText ? (
                <div className="prose">
                  <PrismicRichText field={item.richText} />
                </div>
              ) : (
                <ReactMarkdown className="react-markdown prose max-w-full">
                  {translatedText}
                </ReactMarkdown>
              )}
            </SponsorModal>
          );
        });
      })}
    </>
  );
}
