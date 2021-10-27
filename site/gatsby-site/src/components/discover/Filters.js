import React, { useState } from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import RangeInput from './filters/RangeInput';
import RefinementList from './filters/RefinementList';

function Filter({ attribute, ...rest }) {
  let Component = null;

  switch (attribute) {
    case 'epoch_incident_date':
    case 'epoch_date_published':
      Component = RangeInput;
      break;
    default:
      Component = RefinementList;
      break;
  }

  return <Component attribute={attribute} {...rest} />;
}

const FiltersModalList = styled.div`
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
`;

function Filters() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  return (
    <>
      <Row className="d-none d-md-flex justify-content-md-between mb-3">
        <Col className="d-flex mt-2 gap-1">
          {['classifications', 'source_domain', 'authors', 'submitters', 'incident_id']
            .map((a) => REFINEMENT_LISTS.find((list) => list.attribute == a))
            .map((list) => (
              <Filter key={list.attribute} attribute={list.attribute} {...list} />
            ))}
        </Col>
        <Col className="d-flex gap-1 mt-2">
          {['epoch_incident_date', 'epoch_date_published', 'flag']
            .map((a) => REFINEMENT_LISTS.find((list) => list.attribute == a))
            .map((list) => (
              <Filter key={list.attribute} attribute={list.attribute} {...list} />
            ))}
        </Col>
      </Row>

      <Row className="my-3 d-md-none">
        <Col className="d-flex justify-content-end">
          <Button variant="link" onClick={() => setShowModal(true)}>
            Configure Filters
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FiltersModalList>
            {REFINEMENT_LISTS.map((list) => (
              <Filter key={list.attribute} attribute={list.attribute} {...list} />
            ))}
          </FiltersModalList>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Filters;
