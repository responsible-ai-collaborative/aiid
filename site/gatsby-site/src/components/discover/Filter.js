import React from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { OverlayTrigger, Badge, Card, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import componentsMap from './filterTypes';
import useSearch from './useSearch';
import VirtualFilters from './VirtualFilters';

const ButtonToggle = function ButtonToggle({
  trigger: { ref, ...triggerHandler },
  label,
  faIcon,
  touched,
}) {
  return (
    <Dropdown.Toggle
      ref={ref}
      variant={touched ? 'success' : 'primary'}
      className="w-100"
      {...triggerHandler}
    >
      <FontAwesomeIcon icon={faIcon} />
      &nbsp; {label} &nbsp;{' '}
      {touched > 0 && (
        <Badge bg="light" text="dark">
          {touched}
        </Badge>
      )}
    </Dropdown.Toggle>
  );
};

const FilterOverlay = React.forwardRef(function Container(
  { type, filterProps, ...overlayProps },
  ref
) {
  const { default: Component } = componentsMap[type];

  const instantSearch = useSearch();

  return (
    <div ref={ref} {...overlayProps} style={{ ...overlayProps.style, width: 320, zIndex: 1055 }}>
      <InstantSearch {...instantSearch}>
        <VirtualFilters />
        <Card className="shadow-lg">
          <Card.Body>
            <Component {...filterProps} />
          </Card.Body>
        </Card>
      </InstantSearch>
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
