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
        <FontAwesomeIcon
          className="mr-2 -mt-1"
          icon={faQuoteLeft}
          title={t('Citation Info')}
          titleId={'citation-info-icon'}
        />
        <Trans>Citation Info</Trans>
      </Button>
      {show && (
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
                  incidentTitle={incident.title}
                  editors={incident.editors}
                />
              );
            })}

            <div className="flex items-center space-x-2 rounded-b border-gray-200 dark:border-gray-600 border-t mt-4 pt-2 py-2 pb-0">
              <Button onClick={handleClose}>
                <Trans>Close</Trans>
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default CitationFormat;
