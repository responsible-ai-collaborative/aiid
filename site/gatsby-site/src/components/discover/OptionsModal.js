import React, { useState } from 'react';
import { Modal, Accordion, Form } from 'react-bootstrap';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { AccordionFilter } from './Filter';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import { Trans } from 'react-i18next';
import DisplayModeSwitch from './DisplayModeSwitch';
import Button from 'elements/Button';
// https://www.algolia.com/doc/guides/building-search-ui/going-further/native/react/?language=react#create-a-modal

function OptionsModal({ searchState, setSearchState }) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  return (
    <div className="bootstrap">
      <div className="flex flex-wrap -ml-3 mr-0 mt-0 my-4 md:hidden">
        <div className="flex items-center w-full lg:flex-1">
          <Stats />
        </div>
        <div className="flex justify-end w-full lg:flex-1">
          <ClearFilters>
            <Trans>Clear</Trans>
          </ClearFilters>
          <Button variant="link" onClick={() => setShowModal(true)}>
            <Trans>Options</Trans>
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose} enforceFocus={false} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>Search Options</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="tw-options-modal-hbox">
            <Form.Check
              type="switch"
              id="hide-duplicates-modal"
              checked={searchState.refinementList.hideDuplicates}
              onClick={(event) => {
                setSearchState({
                  ...searchState,
                  refinementList: {
                    ...searchState.refinementList,
                    hideDuplicates: event.target.checked,
                  },
                });
              }}
            />
            <Form.Label for="hide-duplicates-modal">
              <Trans>1st report only</Trans>
            </Form.Label>
            <DisplayModeSwitch />
          </div>

          <Accordion defaultActiveKey="0">
            {REFINEMENT_LISTS.map((list) => (
              <AccordionFilter key={list.attribute} attribute={list.attribute} {...list} />
            ))}
          </Accordion>
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
