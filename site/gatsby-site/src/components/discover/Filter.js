import React from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { Button, OverlayTrigger, Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import componentsMap from './filters';

const ButtonToggle = function ButtonToggle({
  trigger: { ref, ...triggerHandler },
  label,
  faIcon,
  touched,
}) {
  return (
    <Button ref={ref} variant={touched ? 'success' : 'primary'} {...triggerHandler}>
      <FontAwesomeIcon icon={faIcon} />
      &nbsp; {label} &nbsp;{' '}
      {touched > 0 && (
        <Badge bg="light" text="dark">
          {touched}
        </Badge>
      )}
    </Button>
  );
};

const FilterOverlay = React.forwardRef(function Container(
  { type, instantSearch, filterProps, ...overlayProps },
  ref
) {
  const { default: Component } = componentsMap[type];

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

  const touched = touchedCount({
    items: instantSearch.searchState.refinementList[attribute],
    range: instantSearch.searchState.range[attribute],
  });

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
