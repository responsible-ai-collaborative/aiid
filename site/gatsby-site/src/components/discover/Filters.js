import React from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { Row, Col } from 'react-bootstrap';
import Filter from './Filter';
import styled from 'styled-components';

const StyledFilter = styled(Filter)`
  width: 100%;
  .dropdown-toggle {
    width: 100%;
  }
`;

function Filters() {
  return (
    <Row xs={1} md={2} lg={4} className="hidden md:flex gap-y-2 mt-3 flex-wrap">
      {REFINEMENT_LISTS.map((list) => (
        <Col
          key={list.attribute}
          className={`w-full flex-0-0-auto md:w-1/2 992px:w-1/4 px-2 bootstrap ${
            list.hidden ? 'hidden' : ''
          }`}
        >
          <StyledFilter type={list.type} {...list} />
        </Col>
      ))}
    </Row>
  );
}

export default Filters;
