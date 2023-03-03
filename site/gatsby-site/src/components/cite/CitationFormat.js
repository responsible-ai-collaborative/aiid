import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal } from 'flowbite-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import citationTypes from './citationTypes';

function CitationFormat({ incidentReports, incident }) {
  const { t } = useTranslation();

  const formats = {
    citation: {},
    bibTex: {},
  };

  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <Button color="gray" onClick={handleShow}>
        <FontAwesomeIcon className="mr-2 -mt-1" icon={faQuoteLeft} title={t('Citation Info')} />
        <Trans>Citation Info</Trans>
      </Button>
      <Modal show={show} onClose={handleClose} data-cy="citation-info-modal">
        <Modal.Header>
          <Trans>Citation Info</Trans>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(formats).map((format) => {
            const Component = citationTypes[format].default;

            return (
              <Component
                key={format}
                nodes={incidentReports}
                incidentDate={incident.date}
                incident_id={incident.incident_id}
                editors={incident.editors}
              />
            );
          })}

          <Modal.Footer>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CitationFormat;
