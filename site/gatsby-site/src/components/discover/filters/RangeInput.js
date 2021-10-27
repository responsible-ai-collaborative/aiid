import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { debounce } from 'debounce';
import { connectRange } from 'react-instantsearch-dom';
import { Form, Dropdown, Badge } from 'react-bootstrap';
import { add, formatISO, isAfter } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateDate } from 'utils/date';

const RangeInput = ({ faIcon, label, faClasses, currentRefinement: { min, max }, refine }) => {
  if (!min || !max) {
    return null;
  }

  const [localMin, setLocalMin] = useState(validateDate(min));

  const [localMax, setLocalMax] = useState(validateDate(max));

  const [limitInterval, setLimitInterval] = useState({ min: 0, max: 0 });

  useEffect(() => {
    setLimitInterval({
      min: formatISO(validateDate(min), { representation: 'date' }),
      max: formatISO(validateDate(max), { representation: 'date' }),
    });
  }, []);

  useEffect(() => {
    setLocalMin(validateDate(min));
    setLocalMax(validateDate(max));
  }, [min, max]);

  if (!localMax || !localMin) {
    return null;
  }

  const onChangeMinDate = debounce((newInput) => {
    try {
      if (
        newInput !== '' &&
        newInput.length <= 10 &&
        isAfter(new Date(newInput), new Date(limitInterval.min))
      ) {
        setLocalMin(new Date(newInput || limitInterval.min).getTime());
        refine({
          max: validateDate(localMax) / 1000,
          min: validateDate(new Date(newInput || limitInterval.min).getTime()) / 1000,
        });
      }
    } catch (error) {
      refine({
        max: validateDate(localMax) / 1000,
        min: validateDate(add(validateDate(localMax) / 1000, { seconds: 1 }).getTime()) / 1000,
      });
    }
  }, 1000);

  const onChangeMaxDate = debounce((newInput) => {
    try {
      if (newInput !== '' && newInput.length <= 10) {
        setLocalMax(new Date(newInput || limitInterval.max).getTime());
        refine({
          max: validateDate(new Date(newInput || limitInterval.max).getTime()) / 1000,
          min: validateDate(localMin) / 1000,
        });
      }
    } catch (error) {
      refine({
        min: validateDate(localMin) / 1000,
        max: validateDate(add(validateDate(localMin) / 1000, { seconds: 1 }).getTime()) / 1000,
      });
    }
  }, 1000);

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (localMin !== min * 1000 || localMax !== max * 1000) {
      setTouched(true);
    } else {
      setTouched(false);
    }
  }, [localMin, localMax]);

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle>
        <FontAwesomeIcon icon={faIcon} className={faClasses} />
        {` ${label}`}&nbsp; {touched && <Badge>!</Badge>}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Form className="px-3">
          <Form.Label>From Date:</Form.Label>
          <Form.Control
            required={true}
            type="date"
            defaultValue={formatISO(localMin, { representation: 'date' })}
            onChange={(event) => onChangeMinDate(event.currentTarget.value)}
            min={limitInterval.min}
            onKeyDown={(e) => e.preventDefault()}
          />

          <Form.Label>To Date:</Form.Label>
          <Form.Control
            required={true}
            type="date"
            defaultValue={formatISO(localMax, { representation: 'date' })}
            onChange={(event) => onChangeMaxDate(event.currentTarget.value)}
            onKeyDown={(e) => e.preventDefault()}
          />
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default connectRange(styled(RangeInput)``);
