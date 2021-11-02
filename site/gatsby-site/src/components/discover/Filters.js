import React from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { Row, Col } from 'react-bootstrap';
import Filter from './Filter';

function Filters() {
  return (
    <>
      <Row className="d-none d-md-flex justify-content-md-between mb-3">
        <Col className="d-flex mt-2 gap-1 col-md-auto flex-wrap">
          {['classifications', 'source_domain', 'authors', 'submitters', 'incident_id']
            .map((a) => REFINEMENT_LISTS.find((list) => list.attribute == a))
            .map((list) => (
              <Filter key={list.attribute} type={list.type} {...list} />
            ))}
        </Col>
        <Col className="d-flex gap-1 mt-2 col-md-auto">
          {['epoch_incident_date', 'epoch_date_published', 'flag']
            .map((a) => REFINEMENT_LISTS.find((list) => list.attribute == a))
            .map((list) => (
              <Filter key={list.attribute} attribute={list.attribute} {...list} />
            ))}
        </Col>
      </Row>
    </>
  );
}

export default Filters;
