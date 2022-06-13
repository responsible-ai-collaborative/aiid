import React from 'react';
import styled from 'styled-components';
import { connectRange } from 'react-instantsearch-dom';
import { Form, Button } from 'react-bootstrap';
import useSearch from '../useSearch';

const formatDate = (epoch) => new Date(epoch * 1000).toISOString().substr(0, 10);

const dateToEpoch = (date) => new Date(date).getTime() / 1000;

const RangeInput = ({ min, max, currentRefinement, refine, attribute }) => {
  if (!min || !max) {
    return null;
  }

  const onChange = ({ min, max }) => {
    if (currentRefinement.min !== min || currentRefinement.max !== max) {
      refine({ min, max });
    }
  };

  const clear = () => {
    refine({});
  };

  const { searchState } = useSearch();

  const touchedMin = searchState.range[attribute] && searchState.range[attribute].min;

  const touchedMax = searchState.range[attribute] && searchState.range[attribute].max;

  const clearEnabled = touchedMin || touchedMax;

  return (
    <>
      <Form className="px-3">
        <Form.Label>From Date:</Form.Label>
        <Form.Control
          required={true}
          type="date"
          min={formatDate(min)}
          max={formatDate(
            currentRefinement.min > currentRefinement.max
              ? max
              : Math.min(max, currentRefinement.max)
          )}
          value={formatDate(currentRefinement.min)}
          onChange={(event) =>
            onChange({ min: dateToEpoch(event.target.value), max: currentRefinement.max })
          }
          onKeyDown={(e) => e.preventDefault()}
          className={touchedMin && 'border border-success'}
        />

        <Form.Label className="mt-3">To Date:</Form.Label>
        <Form.Control
          required={true}
          type="date"
          min={formatDate(
            currentRefinement.min > currentRefinement.max
              ? min
              : Math.max(min, currentRefinement.min)
          )}
          max={formatDate(max)}
          value={formatDate(currentRefinement.max)}
          onChange={(event) =>
            onChange({ min: currentRefinement.min, max: dateToEpoch(event.target.value) })
          }
          onKeyDown={(e) => e.preventDefault()}
          className={touchedMax && 'border border-success'}
        />

        <Button
          variant="link secondary"
          className="mt-4 text-decoration-none"
          onClick={clear}
          disabled={!clearEnabled}
        >
          Clear
        </Button>
      </Form>
    </>
  );
};

export const touchedCount = ({ searchState, attribute }) =>
  searchState.range[attribute] &&
  (searchState.range[attribute].min || searchState.range[attribute].max)
    ? 1
    : 0;

export default connectRange(styled(RangeInput)``);
