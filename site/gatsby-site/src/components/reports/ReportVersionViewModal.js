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
  faUser,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { format, fromUnixTime } from 'date-fns';
import { Modal, Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import Row from 'elements/Row';
import Col from 'elements/Col';
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
      </Modal.Header>

      {version && (
        <>
          <Modal.Body>
            <div className="flex flex-col gap-3">
              {version.modifiedByUser && (
                <Row>
                  <Col className="flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faUser} title={t('Modified by')} />
                    <div className="font-bold w-36">
                      <Trans ns="submit">Modified by</Trans>:
                    </div>
                    <div>
                      {version.modifiedByUser.first_name} {version.modifiedByUser.last_name}
                    </div>
                  </Col>
                </Row>
              )}
              {version.epoch_date_modified && (
                <Row>
                  <Col className="flex items-center gap-2">
                    <FontAwesomeIcon fixedWidth icon={faCalendarDays} title={t('Modified on')} />
                    <div className="font-bold w-36">
                      <Trans ns="submit">Modified on</Trans>:
                    </div>
                    {format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}
                  </Col>
                </Row>
              )}
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faLink} title={t('Report Address')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Report Address</Trans>:
                  </div>
                  {version.url}
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faTenge} title={t('Title')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Title</Trans>:
                  </div>
                  {version.title}
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faPenNib} title={t('Author CSV')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Author CSV</Trans>:
                  </div>
                  {version.authors.join(', ')}
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faMedal} title={t('Submitter CSV')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Submitter CSV</Trans>:
                  </div>
                  {version.submitters.join(', ')}
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faCalendar} title={t('Date Published')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Date Published</Trans>:
                  </div>
                  {version.date_published}
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faDownload} title={t('Date Downloaded')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Date Downloaded</Trans>:
                  </div>
                  {version.date_downloaded}
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faImage} title={t('Image Address')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Image Address</Trans>:
                  </div>
                  {version.image_url}
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center justify-center gap-2">
                  <div className="h-40 flex justify-center">
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
                </Col>
              </Row>
              <Row>
                <Col className="flex items-start gap-2">
                  <div className="flex items-center gap-2 mt-1">
                    <FontAwesomeIcon fixedWidth icon={faNewspaper} title={t('Text')} />
                    <div className="font-bold w-36">
                      <Trans ns="submit">Text</Trans>:
                    </div>
                  </div>
                  <div className="h-44 p-2 border rounded-md overflow-scroll">
                    <Markdown>{version.text}</Markdown>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faLanguage} title={t('Language')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Language</Trans>:
                  </div>
                  {supportedLanguages.find((l) => l.code == version.language)?.name}
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faTag} title={t('Tags')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Tags</Trans>:
                  </div>
                  <div>
                    {version.tags.map((tag, index) => (
                      <div
                        key={`added_${index}`}
                        className="inline-block h-6 center bg-green-100 text-green-800 text-xs font-semibold m-1 px-2.5 py-1 rounded"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="flex items-center gap-2">
                  <FontAwesomeIcon fixedWidth icon={faAlignLeft} title={t('Editor Notes')} />
                  <div className="font-bold w-36">
                    <Trans ns="submit">Editor Notes</Trans>:
                  </div>
                  {version.editor_notes}
                </Col>
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
