import React from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { Row, Col } from 'react-bootstrap';
import Filter from './Filter';
import styled from 'styled-components';

const StyledFilter = styled(Filter)`
  .dropdown-toggle {
    width: 100%;
  }
`;

function Filters() {
  return (
    <Row xs={1} md={2} lg={4} className="d-none d-md-flex mt-2 mb-4 g-2">
      {REFINEMENT_LISTS.map((list) => (
        <Col key={list.attribute}>
          <StyledFilter type={list.type} {...list} />
        </Col>
      ))}
    </Row>
  );
}

export default Filters;
