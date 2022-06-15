import React, { useState, useEffect } from 'react';
import REFINEMENT_LISTS from './REFINEMENT_LISTS';
import styled from 'styled-components';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import DisplayModeSwitch from './DisplayModeSwitch';
import Filters from './Filters';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const FlexGap = styled(Col)`
  margin: auto;
`;

const ExpandFilters = styled.button`
  user-select: none;
  cursor: pointer;
  color: inherit;
  background: none;
  border: none;
`;

const ExpandArrow = styled(FontAwesomeIcon)`
  vertical-align: -0.2em !important;
`;

const Controls = ({ query }) => {
  const [expandFilters, setExpandFilters] = useState(false);

  useEffect(() => {
    let filter = false;

    for (let refinement of REFINEMENT_LISTS) {
      if (query[refinement.attribute]) {
        filter = true;
        break;
      }
    }
    if (filter) {
      setExpandFilters(true);
    }
  }, []);

  return (
    <>
      <Row className="justify-content-start align-items-center mt-3 hiddenMobile">
        <Col className="col-auto">
          <Stats />
        </Col>
        <Col className="col-auto">
          <DisplayModeSwitch />
        </Col>
        <FlexGap />
        <Col className="col-auto">
          <ClearFilters>Clear Filters</ClearFilters>
        </Col>
        <Col className="col-auto">
          <ExpandFilters
            id="expand-filters"
            data-cy="expand-filters"
            onClick={() => setExpandFilters(!expandFilters)}
          >
            <ExpandArrow icon={expandFilters ? faCaretDown : faCaretRight} fixedWidth /> Filter
            Search
          </ExpandFilters>
        </Col>
      </Row>
      <Row className="mb-3 hiddenMobile">{expandFilters ? <Filters /> : <div></div>}</Row>
    </>
  );
};

export default Controls;
