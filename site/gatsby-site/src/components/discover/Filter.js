import React from 'react';
import { OverlayTrigger, Badge, Card, Dropdown, Accordion } from 'react-bootstrap';
import { InstantSearch } from 'react-instantsearch-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import componentsMap from './filterTypes';
import useSearch from './useSearch';
import VirtualFilters from './VirtualFilters';
import styled from 'styled-components';
import { Trans } from 'react-i18next';

function ToggleContent({ label, touched, faIcon }) {
  return (
    <>
      {faIcon && <FontAwesomeIcon icon={faIcon} />}
      &nbsp; <Trans>{label}</Trans> &nbsp;{' '}
      {touched > 0 && (
        <Badge bg="light" text="dark">
          {touched}
        </Badge>
      )}
    </>
  );
}

function ButtonToggle({ trigger: { ref, ...triggerHandler }, label, faIcon, touched }) {
  return (
    <Dropdown.Toggle
      ref={ref}
      variant={touched ? 'success' : 'primary'}
      className="w-full"
      {...triggerHandler}
    >
      <ToggleContent faIcon={faIcon} label={label} touched={touched} />
    </Dropdown.Toggle>
  );
}

function FilterContent({ type, filterProps }) {
  const { default: Component } = componentsMap[type];

  const instantSearch = useSearch();

  return (
    <InstantSearch {...instantSearch}>
      <VirtualFilters />
      <Component {...filterProps} />
    </InstantSearch>
  );
}

const FilterOverlay = React.forwardRef(function Container(
  { type, filterProps, ...overlayProps },
  ref
) {
  return (
    <div
      ref={ref}
      {...overlayProps}
      style={{ ...overlayProps.style, width: 320, zIndex: 1055 }}
      className="bootstrap"
    >
      <Card className="shadow-lg">
        <Card.Body>
          <FilterContent type={type} filterProps={filterProps} />
        </Card.Body>
      </Card>
    </div>
  );
});

export default function Filter({ type, ...filterProps }) {
  const { label, faIcon, attribute } = filterProps;

  const { touchedCount } = componentsMap[type];

  const instantSearch = useSearch();

  const { searchState } = instantSearch;

  const touched = touchedCount({ searchState, attribute });

  return (
    <>
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="bottom-start"
        overlay={<FilterOverlay type={type} filterProps={filterProps} />}
      >
        {(trigger) => (
          <ButtonToggle
            trigger={trigger}
            label={label}
            faIcon={faIcon}
            attribute={attribute}
            touched={touched}
          />
        )}
      </OverlayTrigger>
    </>
  );
}

const StyledAccordionHeader = styled(Accordion.Header)`
  button {
    background-color: ${({ bg }) => `var(--bs-${bg})`};
    color: var(--bs-white);
  }
`;

function AccordionFilter({ type, ...filterProps }) {
  const { label, faIcon, attribute } = filterProps;

  const { touchedCount } = componentsMap[type];

  const instantSearch = useSearch();

  const { searchState } = instantSearch;

  const touched = touchedCount({ searchState, attribute });

  return (
    <Accordion.Item eventKey={attribute} className={`${filterProps.hidden ? 'hidden' : ''}`}>
      <StyledAccordionHeader bg={touched ? 'success' : 'primary'}>
        <ToggleContent faIcon={faIcon} label={label} touched={touched} />
      </StyledAccordionHeader>
      <Accordion.Body>
        <FilterContent type={type} filterProps={filterProps} />
      </Accordion.Body>
    </Accordion.Item>
  );
}

export { AccordionFilter };
