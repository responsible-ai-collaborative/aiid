import React from 'react';
import styled from 'styled-components';
import { connectRange } from 'react-instantsearch-dom';
import { Form, Dropdown, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const formatDate = (epoch) => new Date(epoch * 1000).toISOString().substr(0, 10);

const dateToEpoch = (date) => new Date(date).getTime() / 1000;

const RangeInput = ({
  faIcon,
  label,
  faClasses,
  min,
  max,
  currentRefinement,
  refine,
  className,
}) => {
  const onChange = ({ min, max }) => {
    if (currentRefinement.min !== min || currentRefinement.max !== max) {
      refine({ min, max });
    }
  };

  const touched = currentRefinement.min !== min || currentRefinement.max !== max;

  const enabled = min && max;

  return (
    <Dropdown autoClose="outside" className={className}>
      <Dropdown.Toggle disabled={!enabled}>
        <FontAwesomeIcon icon={faIcon} className={faClasses} />
        {` ${label}`}&nbsp;{touched && <Badge bg="secondary">!</Badge>}
      </Dropdown.Toggle>

      {enabled && (
        <Dropdown.Menu>
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
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
};

export default connectRange(styled(RangeInput)``);
