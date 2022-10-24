import React from 'react';
import styled from 'styled-components';
import { connectRange } from 'react-instantsearch-dom';
import { Form, Button } from 'react-bootstrap';
import useSearch from '../useSearch';
import { Trans } from 'react-i18next';
import { debounce } from 'debounce';

const formatDate = (epoch) => new Date(epoch * 1000).toISOString().substr(0, 10);

const dateToEpoch = (date) => new Date(date).getTime() / 1000;

const RangeInput = ({ min, max, currentRefinement, refine, attribute }) => {
  if ((!min && min !== 0) || (!max && max !== 0)) {
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
    <div className="bootstrap">
      <Form className="px-3">
        <Form.Label>
          <Trans>From Date</Trans>:
        </Form.Label>
        <Form.Control
          required={true}
          type="date"
          min={formatDate(min)}
          max={formatDate(
            currentRefinement.min > currentRefinement.max
              ? max
              : Math.min(max, currentRefinement.max)
          )}
          defaultValue={formatDate(currentRefinement.min)}
          onChange={(event) => {
            const newMin = dateToEpoch(event.target.value);

            if (newMin >= min || currentRefinement.min != min) {
              debounce(() =>
                onChange({ min: Math.max(min, newMin), max: currentRefinement.max })
              )();
            }
          }}
          className={touchedMin && 'border border-success'}
        />

        <Form.Label className="mt-3">
          <Trans>To Date</Trans>:
        </Form.Label>
        <Form.Control
          required={true}
          type="date"
          min={formatDate(
            currentRefinement.min > currentRefinement.max
              ? min
              : Math.max(min, currentRefinement.min)
          )}
          max={formatDate(new Date().valueOf())}
          defaultValue={formatDate(currentRefinement.max)}
          onChange={(event) => {
            const newMax = dateToEpoch(event.target.value);

            if (newMax <= max || currentRefinement.max != max) {
              debounce(() =>
                onChange({ min: currentRefinement.min, max: Math.min(max, newMax) })
              )();
            }
          }}
          className={touchedMax && 'border border-success'}
        />

        <Button
          variant="link secondary"
          className="mt-4 no-underline bootstrap"
          onClick={clear}
          disabled={!clearEnabled}
        >
          <Trans>Clear</Trans>
        </Button>
      </Form>
    </div>
  );
};

export const touchedCount = ({ searchState, attribute }) =>
  searchState.range[attribute] &&
  (searchState.range[attribute].min || searchState.range[attribute].max)
    ? 1
    : 0;

export default connectRange(styled(RangeInput)``);
