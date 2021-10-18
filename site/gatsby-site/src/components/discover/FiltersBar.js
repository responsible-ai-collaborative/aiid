import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Button } from 'react-bootstrap';
import { validateDate } from 'utils/date';

const FiltersContainer = styled.div`
  width: 100;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding-top: 2em;
`;

const Tags = styled(Button)`
  &&& {
    margin-bottom: 0.7em;
    margin-right: 0.5em;
    border-radius: 23px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    p {
      margin-bottom: 0 !important;
      margin-right: 0.4em;
    }
  }
`;

const FiltersBar = ({ filters, updateFilters, updateQuery }) => {
  const flitersArray = [];

  for (const filter in filters.refinementList) {
    const filterName = REFINEMENT_LISTS.filter((f) => f.attribute === filter)[0].label;

    for (const value of filters.refinementList[filter]) {
      flitersArray.push(`${filterName}: ${value}`);
    }
  }

  for (const filter in filters.range) {
    const filterName = REFINEMENT_LISTS.filter((f) => f.attribute.includes(filter))[0].label;

    if (filters.range[filter].min) {
      const value = format(validateDate(filters.range[filter].min), 'MM/dd/yyyy');

      flitersArray.push(`${filterName}: From ${value}`);
    }

    if (filters.range[filter].max) {
      const value = format(validateDate(filters.range[filter].max), 'MM/dd/yyyy');

      flitersArray.push(`${filterName}: To ${value}`);
    }
  }

  if (flitersArray.length === 0) {
    return null;
  }

  return (
    <FiltersContainer>
      {flitersArray.map((filter) => (
        <Tags
          variant="outline-primary"
          key={filter}
          onClick={() => {
            const filterValuePair = filter.split(': ');

            const filterAttr = REFINEMENT_LISTS.filter((f) => f.label === filterValuePair[0])[0]
              .attribute;

            let newFilters = {};

            if (filters.refinementList[filterAttr]) {
              newFilters = {
                ...filters,
                refinementList: {
                  ...filters.refinementList,
                  [filterAttr]: filters.refinementList[filterAttr]?.filter(
                    (v) => v !== filterValuePair[1]
                  ),
                },
              };
            }

            if (filters.range[filterAttr]) {
              const newRangeFilter = {};

              if (filterValuePair[1].split(' ')[0] === 'To') {
                newRangeFilter.min = filters.range[filterAttr].min;
              }

              if (filterValuePair[1].split(' ')[0] === 'From') {
                newRangeFilter.max = filters.range[filterAttr].max;
              }

              newFilters = {
                ...filters,
                range: {
                  ...filters.range,
                  [filterAttr]: { ...newRangeFilter },
                },
              };
            }

            updateFilters({
              ...newFilters,
            });
            updateQuery({
              ...newFilters,
            });
          }}
        >
          <p>{filter}</p>
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="pointer fa fa-times-circle"
            title="reset"
          />
        </Tags>
      ))}
    </FiltersContainer>
  );
};

export default FiltersBar;
