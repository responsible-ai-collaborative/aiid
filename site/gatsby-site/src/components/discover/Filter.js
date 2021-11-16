import React from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { OverlayTrigger, Badge, Card, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import componentsMap from './filterTypes';
import useSearch from './useSearch';

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
  { type, instantSearch, filterProps, ...overlayProps },
  ref
) {
  const { default: Component } = componentsMap[type];

  console.log(instantSearch);

  return (
    <div ref={ref} {...overlayProps} style={{ ...overlayProps.style, width: 320, zIndex: 1055 }}>
      <Card className="shadow-lg">
        <InstantSearch {...instantSearch}>
          <Card.Body>
            <Component {...filterProps} />
          </Card.Body>
        </InstantSearch>
      </Card>
    </div>
  );
});

export default function Filter({ type, instantSearch, ...filterProps }) {
  const { label, faIcon, attribute } = filterProps;

  const { touchedCount } = componentsMap[type];

  const { searchState } = useSearch();

  const touched = touchedCount({ searchState, attribute });

  return (
    <>
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="bottom-start"
        overlay={
          <FilterOverlay instantSearch={instantSearch} type={type} filterProps={filterProps} />
        }
      >
        {(trigger) => (
          <ButtonToggle
            trigger={trigger}
            label={label}
            faIcon={faIcon}
            searchState={instantSearch.searchState}
            attribute={attribute}
            touched={touched}
          />
        )}
      </OverlayTrigger>
    </>
  );
}
