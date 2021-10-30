import React from 'react';
import styled from 'styled-components';
import { connectRange } from 'react-instantsearch-dom';
import { Form, Dropdown, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const formatDate = (epoch) => format(new Date(epoch * 1000), 'yyyy-MM-dd');

const dateToEpoch = (date) => new Date(date).getTime() / 1000;

const RangeInput = ({ faIcon, label, faClasses, min, max, currentRefinement, refine }) => {
  if (!min || !max) {
    return null;
  }

  const onChange = ({ min, max }) => {
    if (currentRefinement.min !== min || currentRefinement.max !== max) {
      refine({ min, max });
    }
  };

  const touched = currentRefinement.min !== min || currentRefinement.max !== max;

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle>
        <FontAwesomeIcon icon={faIcon} className={faClasses} />
        {` ${label}`}&nbsp; {touched && <Badge bg="secondary">!</Badge>}
      </Dropdown.Toggle>

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
    </Dropdown>
  );
};

export default connectRange(styled(RangeInput)``);
