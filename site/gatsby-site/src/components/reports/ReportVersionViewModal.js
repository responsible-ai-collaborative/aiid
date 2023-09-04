import React from 'react';
import md5 from 'md5';
import { fill } from '@cloudinary/base/actions/resize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTag,
  faPenNib,
  faMedal,
  faCalendar,
  faImage,
  faLink,
  faLanguage,
  faDownload,
  faNewspaper,
  faAlignLeft,
  faTenge,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { format, fromUnixTime } from 'date-fns';
import { Modal, Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import Row from 'elements/Row';
import supportedLanguages from 'components/i18n/languages.json';
import { Image } from 'utils/cloudinary';
import Markdown from 'react-markdown';

export default function IncidentVersionViewModal({ show, onClose, version }) {
  const { t } = useTranslation(['submit']);

  if (!show) {
    return null;
  }

  return (
    <Modal
      show={show}
      onClose={onClose}
      className="submission-modal"
      size="4xl"
      data-cy="version-view-modal"
    >
      <Modal.Header>
        <Trans>Version details</Trans>
        <div className="flex gap-5 text-base mt-2">
          {version.modifiedByUser && (
            <div>
              <strong>Modified by</strong>: {version.modifiedByUser.first_name}{' '}
              {version.modifiedByUser.last_name}
            </div>
          )}
          {version.epoch_date_modified && (
            <div>
              <strong>Modified on</strong>:{' '}
              {format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}
            </div>
          )}
        </div>
      </Modal.Header>

      {version && (
        <>
          <Modal.Body>
            <div className="flex flex-col gap-3">
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faLink} title={t('Report Address')} />
                    <Trans ns="submit">Report Address</Trans>:
                  </div>
                  <div className="col-span-6">{version.url}</div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faTenge} title={t('Title')} />
                    <Trans ns="submit">Title</Trans>:
                  </div>
                  <div className="col-span-6">{version.title}</div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faPenNib} title={t('Author CSV')} />
                    <Trans ns="submit">Author CSV</Trans>:
                  </div>
                  <div className="col-span-6">{version.authors.join(', ')}</div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faMedal} title={t('Submitter CSV')} />
                    <Trans ns="submit">Submitter CSV</Trans>:
                  </div>
                  <div className="col-span-6">{version.submitters.join(', ')}</div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faCalendar} title={t('Date Published')} />
                    <Trans ns="submit">Date Published</Trans>:
                  </div>
                  <div className="col-span-6">{version.date_published}</div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faDownload} title={t('Date Downloaded')} />
                    <Trans ns="submit">Date Downloaded</Trans>:
                  </div>
                  <div className="col-span-6">{version.date_downloaded}</div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faImage} title={t('Image Address')} />
                    <Trans ns="submit">Image Address</Trans>:
                  </div>
                  <div className="col-span-6">{version.image_url}</div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8">
                  <div className="h-40 flex col-start-3 col-span-6">
                    <div className="flex">
                      <Image
                        className="h-[320px] object-cover w-full"
                        publicID={
                          version.cloudinary_id
                            ? version.cloudinary_id
                            : `legacy/${md5(version.image_url)}`
                        }
                        alt="Report image"
                        transformation={fill().height(640)}
                        plugins={[]}
                        itemIdentifier="report_image"
                      />
                    </div>
                  </div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-start gap-2">
                    <FontAwesomeIcon fixedWidth icon={faNewspaper} title={t('Text')} />
                    <Trans ns="submit">Text</Trans>:
                  </div>
                  <div className="col-span-6 h-44 p-2 border rounded-md overflow-scroll">
                    <Markdown>{version.text}</Markdown>
                  </div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faLanguage} title={t('Language')} />
                    <Trans ns="submit">Language</Trans>:
                  </div>
                  <div className="col-span-6">
                    {supportedLanguages.find((l) => l.code == version.language)?.name}
                  </div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faTag} title={t('Tags')} />
                    <Trans ns="submit">Tags</Trans>:
                  </div>
                  <div className="col-span-6">
                    {version.tags.map((tag, index) => (
                      <div
                        key={`added_${index}`}
                        className="inline-block h-6 center bg-green-100 text-green-800 text-xs font-semibold m-1 px-2.5 py-1 rounded"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </Row>
              <Row>
                <div className="grid grid-cols-8 gap-2">
                  <div className="font-bold col-span-2 flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faAlignLeft} title={t('Editor Notes')} />
                    <Trans ns="submit">Editor Notes</Trans>:
                  </div>
                  <div className="col-span-6"></div>
                  {version.editor_notes}
                </div>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={onClose}>
              <Trans>Close</Trans>
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
