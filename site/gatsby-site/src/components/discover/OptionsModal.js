import React, { useState } from 'react';
import { Row, Col, Modal, Button, Accordion, Form } from 'react-bootstrap';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { AccordionFilter } from './Filter';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import DisplayModeSwitch from './DisplayModeSwitch';
// https://www.algolia.com/doc/guides/building-search-ui/going-further/native/react/?language=react#create-a-modal

const Hbox = styled.div`
  margin-bottom: 1em;
  display: flex;
  gap: 1.5em;
  align-items: center;
  > * {
    line-height: 2em;
    vertical-align: middle;
    margin: 0px !important;
  }
  input {
    vertical-align: middle;
    margin: 0px;
    transform-origin: center left;
    transform: scale(1.5);
  }
  > *:last-child {
    margin-left: auto !important;
  }
`;

function OptionsModal({ setHideDuplicates, hideDuplicates }) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  return (
    <>
      <Row className="my-3 d-md-none">
        <Col className="d-flex align-items-center">
          <Stats />
        </Col>
        <Col className="d-flex justify-content-end">
          <ClearFilters>
            <Trans>Clear</Trans>
          </ClearFilters>
          <Button variant="link" onClick={() => setShowModal(true)}>
            <Trans>Options</Trans>
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose} enforceFocus={false} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>Search Options</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Hbox>
            <Form.Check
              type="switch"
              id="hide-duplicates-modal"
              checked={hideDuplicates}
              onClick={(event) => {
                setHideDuplicates(event.target.checked);
              }}
            />
            <Form.Label for="hide-duplicates-modal">
              <Trans>1st report only</Trans>
            </Form.Label>
            <DisplayModeSwitch />
          </Hbox>
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
    </>
  );
}

export default OptionsModal;
