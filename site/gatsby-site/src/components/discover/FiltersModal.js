import React, { useState } from 'react';
import { Row, Col, Modal, Button, Accordion } from 'react-bootstrap';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { AccordionFilter } from './Filter';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import { Trans } from 'react-i18next';
// https://www.algolia.com/doc/guides/building-search-ui/going-further/native/react/?language=react#create-a-modal

function FiltersModal() {
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
            <Trans>Filters</Trans>
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose} enforceFocus={false} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trans>Filters</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

export default FiltersModal;
