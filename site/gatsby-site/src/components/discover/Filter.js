import React from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import RangeInput from './filters/RangeInput';
import RefinementList from './filters/RefinementList';
import { Button, OverlayTrigger, Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const componentsMap = {
  refinement: RefinementList,
  range: RangeInput,
};

const ButtonToggle = function ButtonToggle({
  trigger: { ref, ...triggerHandler },
  searchState,
  label,
  faIcon,
  attribute,
}) {
  const items = searchState.refinementList[attribute] || [];

  const touched = items.length > 0;

  return (
    <Button ref={ref} variant={touched ? 'success' : 'primary'} {...triggerHandler}>
      <FontAwesomeIcon icon={faIcon} />
      &nbsp; {label} &nbsp;{' '}
      {touched && (
        <Badge bg="light" text="dark">
          {items.length}
        </Badge>
      )}
    </Button>
  );
};

const FilterOverlay = React.forwardRef(function Container(
  { type, instantSearch, filterProps, ...overlayProps },
  ref
) {
  const Component = componentsMap[type];

  return (
    <div ref={ref} {...overlayProps} style={{ ...overlayProps.style, width: 400 }}>
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
          />
        )}
      </OverlayTrigger>
    </>
  );
}
