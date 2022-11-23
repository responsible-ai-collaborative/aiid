import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { AccordionFilter } from './Filter';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import { Trans } from 'react-i18next';
import DisplayModeSwitch from './DisplayModeSwitch';
import Button from 'elements/Button';
import DisplayOptions from './DisplayOptions';
import { Modal } from 'flowbite-react';

// https://www.algolia.com/doc/guides/building-search-ui/going-further/native/react/?language=react#create-a-modal

function OptionsModal() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <div className="my-4 md:hidden flex justify-between">
        <div className="flex items-center">
          <Stats />
        </div>
        <div className="flex justify-end">
          <ClearFilters>
            <Trans>Clear</Trans>
          </ClearFilters>
          <Button variant="link" onClick={() => setShowModal(true)}>
            <Trans>Options</Trans>
          </Button>
        </div>
      </div>
      <Modal show={showModal} onClose={handleClose}>
        <Modal.Header>
          <Trans>Search Options</Trans>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="tw-options-modal-hbox">
              <DisplayOptions />
              <DisplayModeSwitch />
            </div>
            <div className="bootstrap">
              <Accordion defaultActiveKey="0">
                {REFINEMENT_LISTS.map((list) => (
                  <AccordionFilter key={list.attribute} attribute={list.attribute} {...list} />
                ))}
              </Accordion>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <Trans>Close</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OptionsModal;
