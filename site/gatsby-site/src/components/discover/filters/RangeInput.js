import React from 'react';
import styled from 'styled-components';
import { connectRange } from 'react-instantsearch-dom';
import { Form } from 'react-bootstrap';

const formatDate = (epoch) => new Date(epoch * 1000).toISOString().substr(0, 10);

const dateToEpoch = (date) => new Date(date).getTime() / 1000;

const RangeInput = ({ min, max, currentRefinement, refine }) => {
  if (!min || !max) {
    return null;
  }

  const onChange = ({ min, max }) => {
    if (currentRefinement.min !== min || currentRefinement.max !== max) {
      refine({ min, max });
    }
  };

  return (
    <>
      <Form className="px-3">
        <Form.Label>From Date:</Form.Label>
        <Form.Control
          required={true}
          type="date"
          min={formatDate(min)}
          max={formatDate(max)}
          value={formatDate(currentRefinement.min)}
          onChange={(event) =>
            onChange({ min: dateToEpoch(event.target.value), max: currentRefinement.max })
          }
          onKeyDown={(e) => e.preventDefault()}
        />

        <Form.Label>To Date:</Form.Label>
        <Form.Control
          required={true}
          type="date"
          min={formatDate(min)}
          max={formatDate(max)}
          value={formatDate(currentRefinement.max)}
          onChange={(event) =>
            onChange({ min: currentRefinement.min, max: dateToEpoch(event.target.value) })
          }
          onKeyDown={(e) => e.preventDefault()}
        />
      </Form>
    </>
  );
};

export default connectRange(styled(RangeInput)``);
