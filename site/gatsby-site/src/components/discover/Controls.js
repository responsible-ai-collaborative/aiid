import React, { useState, useEffect } from 'react';
import REFINEMENT_LISTS from './REFINEMENT_LISTS';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import DisplayModeSwitch from './DisplayModeSwitch';
import Filters from './Filters';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import Row from 'elements/Row';
import Col from 'elements/Col';

const Controls = ({ query, setHideDuplicates, hideDuplicates }) => {
  const [expandFilters, setExpandFilters] = useState(false);

  useEffect(() => setExpandFilters(REFINEMENT_LISTS.some((r) => query[r.attribute])), []);

  return (
    <>
      <Row className="tw-content-start items-center mt-4 767px:hidden hiddenMobile">
        <Col className="col-auto">
          <Stats />
        </Col>
        <Col className="col-auto">
          <DisplayModeSwitch />
        </Col>
        <Col className="tw-hbox">
          <Form.Check
            type="switch"
            id="hide-duplicates"
            checked={hideDuplicates}
            onClick={(event) => {
              setHideDuplicates(event.target.checked);
            }}
            className="tw-switch"
          />
          <Form.Label for="hide-duplicates">
            <Trans>1st report only</Trans>
          </Form.Label>
        </Col>
        <Col className="col-auto">
          <ClearFilters>
            <Trans>Clear Filters</Trans>
          </ClearFilters>
        </Col>
        <Col className="col-auto">
          <button
            id="expand-filters"
            data-cy="expand-filters"
            onClick={() => setExpandFilters(!expandFilters)}
            className="select-none cursor-pointer bg-none border-none"
          >
            <FontAwesomeIcon
              className="-align-[0.2rem]"
              icon={expandFilters ? faCaretDown : faCaretRight}
              fixedWidth
            />
            <Trans>Filter Search</Trans>
          </button>
        </Col>
      </Row>
      <Row className="mb-3 hiddenMobile">{expandFilters && <Filters />}</Row>
    </>
  );
};

export default Controls;
