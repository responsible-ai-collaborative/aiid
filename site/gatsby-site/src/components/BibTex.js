import React, { useState } from 'react';
import { Button as BSButton } from 'react-bootstrap';
import { getFormattedName } from '../utils/typography';
import { format } from 'date-fns';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';
import { Modal, Button } from 'flowbite-react';
import { faCopy, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BibTex = ({ nodes, incidentDate, incident_id, editors }) => {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const addToast = useToastContext();

  const docs = [...nodes];

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a['submission_date'] > b['submission_date'];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]['submitters'][0]);

  const firstEditor = editors[0];

  const nameFragments = firstEditor.split(' ');

  const editorLastName = nameFragments[nameFragments.length - 1];

  const editorFirstName = nameFragments[0];

  const bibTex =
    '@article {' +
    `
      aiid:${incident_id},
      author = {${submitterCite}},
      editor = {${editorLastName}, ${editorFirstName}},
      journal = {AI Incident Database},
      publisher = {Responsible AI Collaborative},
      title = {Incident Number ${incident_id}},
      url = {https://incidentdatabase.ai/cite/${incident_id}},
      year = {${incidentDate.substring(0, 4)}},
      urldate = {${format(new Date(), 'MMMM d, y')}}`.replace(/^ +/, '\t') +
    '\n' +
    '}';

  const jsx = <code style={{ whiteSpace: 'pre' }}>{bibTex}</code>;

  return (
    <>
      <div className="bootstrap">
        <BSButton variant="outline-primary" onClick={handleShow}>
          <FontAwesomeIcon className="mr-2 -mt-1" icon={faQuoteLeft} title={t('BibTex Citation')} />
          <Trans>BibTex Citation</Trans>
        </BSButton>
      </div>
      <Modal show={show} onClose={handleClose} data-cy="bibtext-modal">
        <Modal.Header>BibTex Citation</Modal.Header>
        <Modal.Body>{jsx}</Modal.Body>
        <Modal.Footer>
          <Button
            style={{ marginRight: 'auto' }}
            onClick={() => {
              navigator.clipboard.writeText(bibTex);
              addToast({
                message: 'BibTeX copied to clipboard',
                severity: SEVERITY.success,
              });
            }}
          >
            <FontAwesomeIcon
              icon={faCopy}
              className="fas fa-times"
              style={{ marginRight: '1ch' }}
            />
            Copy
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BibTex;
