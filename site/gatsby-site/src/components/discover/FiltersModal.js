import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import styled from 'styled-components';
import Filter from './Filter';
import { InstantSearch } from 'react-instantsearch-core';
import Stats from './Stats';
import ClearFilters from './ClearFilters';

const FiltersModalList = styled.div`
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
`;

// TODO: https://www.algolia.com/doc/guides/building-search-ui/going-further/native/react/?language=react#create-a-modal
function FiltersModal({ searchClient, indexName, searchState, onSearchStateChange }) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  return (
    <>
      <Row className="my-3 d-md-none">
        <Col className="d-flex align-items-center">
          <Stats />
        </Col>
        <Col className="d-flex justify-content-end">
          <ClearFilters>Clear</ClearFilters>
          <Button variant="link" onClick={() => setShowModal(true)}>
            Filters
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InstantSearch
            indexName={indexName}
            searchClient={searchClient}
            searchState={searchState}
            onSearchStateChange={onSearchStateChange}
          >
            <FiltersModalList>
              {REFINEMENT_LISTS.map((list) => (
                <Filter key={`chucku` + list.attribute} attribute={list.attribute} {...list} />
              ))}
            </FiltersModalList>
          </InstantSearch>
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

export default FiltersModal;
