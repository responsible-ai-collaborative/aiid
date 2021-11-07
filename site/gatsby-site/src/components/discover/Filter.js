import React from 'react';
import { connectCurrentRefinements, InstantSearch } from 'react-instantsearch-dom';
import RangeInput from './filters/RangeInput';
import RefinementList from './filters/RefinementList';
import { Button, OverlayTrigger, Badge, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const componentsMap = {
  refinement: RefinementList,
  range: RangeInput,
};

const ButtonToggle = connectCurrentRefinements(function ButtonToggle({
  trigger: { ref, ...triggerHandler },
  items,
  label,
  faIcon,
}) {
  const refinementCount = items.reduce((total, item) => (item.isRefined ? total + 1 : total), 0);

  const touched = refinementCount > 0;

  return (
    <Button ref={ref} variant={touched ? 'success' : 'primary'} {...triggerHandler}>
      <FontAwesomeIcon icon={faIcon} />
      &nbsp; {label} &nbsp;{' '}
      {refinementCount > 0 && (
        <Badge bg="light" text="dark">
          {refinementCount}
        </Badge>
      )}
    </Button>
  );
});

const FilterOverlay = React.forwardRef(function Container(
  { type, instantSearch, filterProps, ...overlayProps },
  ref
) {
  const Component = componentsMap[type];

  return (
    <Card ref={ref} {...overlayProps} style={{ ...overlayProps.style, width: 400 }}>
      <InstantSearch {...instantSearch}>
        <Card.Body>
          <Component {...filterProps} />
        </Card.Body>
      </InstantSearch>
    </Card>
  );
});

export default function Filter({ type, instantSearch, ...filterProps }) {
  const { label, faIcon } = filterProps;

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
        {(trigger) => <ButtonToggle trigger={trigger} label={label} faIcon={faIcon} />}
      </OverlayTrigger>
    </>
  );
}
