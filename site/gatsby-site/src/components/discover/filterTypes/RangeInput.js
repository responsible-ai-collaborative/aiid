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
  console.log('RangeInput.js');
  console.log(`min`, min);
  console.log(`max`, max);
  console.log(`currentRefinement`, currentRefinement);
  console.log(`refine`, refine);
  console.log(`attribute `, attribute);
  if (!min || !max) {
    console.log('Missing min or max!');
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

  const touchedMin =
    searchState.range && searchState.range[attribute] && searchState.range[attribute].min;

  const touchedMax =
    searchState.range && searchState.range[attribute] && searchState.range[attribute].max;

  const clearEnabled = touchedMin || touchedMax;

  const toMin = formatDate(
    currentRefinement.min > currentRefinement.max ? min : Math.max(min, currentRefinement.min)
  );

  const toMax = formatDate(new Date().valueOf());

  const fromMax = formatDate(
    currentRefinement.min > currentRefinement.max ? max : Math.min(max, currentRefinement.max)
  );

  const fromMin = formatDate(min);

  console.log(`searchState`, searchState);
  console.log(`touchedMin`, touchedMin);
  console.log(`touchedMin`, touchedMax);
  console.log(`clearEnabled`, clearEnabled);
  console.log(`fromMin`, fromMin);
  console.log(`fromMax`, fromMax);
  console.log(`toMin`, toMin);
  console.log(`toMax`, toMax);

  return (
    <div className="bootstrap">
      <Form className="px-3">
        <Form.Label>
          <Trans>From Date</Trans>:
        </Form.Label>
        <Form.Control
          required={true}
          type="date"
          min={fromMin}
          max={fromMax}
          defaultValue={formatDate(currentRefinement.min)}
          onChange={(event) => {
            const selectedMin = dateToEpoch(event.target.value);

            if (selectedMin >= min || currentRefinement.min != min) {
              debounce(() => {
                const newRange = { min: Math.max(min, selectedMin), max: currentRefinement.max };

                console.log(`newRange`, newRange);
                onChange(newRange);
              })();
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
          min={toMin}
          max={toMax}
          defaultValue={formatDate(currentRefinement.max)}
          onChange={(event) => {
            const selectedMax = dateToEpoch(event.target.value);

            if (selectedMax <= max || currentRefinement.max != max) {
              debounce(() => {
                const newRange = { min: currentRefinement.min, max: Math.min(max, selectedMax) };

                console.log(`newRange`, newRange);
                onChange(newRange);
              })();
            }
          }}
          className={touchedMax ? 'border border-success' : ''}
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
  searchState.range &&
  searchState.range[attribute] &&
  (searchState.range[attribute].min || searchState.range[attribute].max)
    ? 1
    : 0;

export default connectRange(styled(RangeInput)``);
