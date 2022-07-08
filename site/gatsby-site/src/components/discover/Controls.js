import React, { useState, useEffect } from 'react';
import REFINEMENT_LISTS from './REFINEMENT_LISTS';
import styled from 'styled-components';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import DisplayModeSwitch from './DisplayModeSwitch';
import Filters from './Filters';
import { Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';

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

const Hbox = styled(Col)`
  display: flex;
  gap: 0.25ch;
  align-items: center;
  padding-right: 0px !important;
  > * {
    line-height: 2em;
    vertical-align: middle;
    margin: 0px !important;
  }
  input {
    vertical-align: middle;
    margin: 0px;
  }
`;

const Controls = ({ query, setHideDuplicates, hideDuplicates }) => {
  const { t } = useTranslation();

  const [expandFilters, setExpandFilters] = useState(false);

  useEffect(() => setExpandFilters(REFINEMENT_LISTS.some((r) => query[r.attribute])), []);

  return (
    <>
      <Row className="justify-content-start align-items-center mt-3 hiddenMobile">
        <Col className="col-auto">
          <Stats />
        </Col>
        <Col className="col-auto">
          <DisplayModeSwitch />
        </Col>
        <Hbox>
          <Form.Check
            type="switch"
            id="hide-duplicates"
            checked={hideDuplicates}
            onClick={(event) => {
              setHideDuplicates(event.target.checked);
            }}
          />
          <Form.Label for="hide-duplicates">
            {t('1st report only').split(' ').join('\u00a0')}
          </Form.Label>
        </Hbox>
        <Col className="col-auto">
          <ClearFilters>
            <Trans>Clear Filters</Trans>
          </ClearFilters>
        </Col>
        <Col className="col-auto">
          <ExpandFilters
            id="expand-filters"
            data-cy="expand-filters"
            onClick={() => setExpandFilters(!expandFilters)}
          >
            <ExpandArrow icon={expandFilters ? faCaretDown : faCaretRight} fixedWidth />
            <Trans>Filter Search</Trans>
          </ExpandFilters>
        </Col>
      </Row>
      <Row className="mb-3 hiddenMobile">{expandFilters && <Filters />}</Row>
    </>
  );
};

export default Controls;
