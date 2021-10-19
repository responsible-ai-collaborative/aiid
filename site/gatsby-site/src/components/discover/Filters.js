import React, { useState, useEffect } from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { debounce } from 'debounce';
import { connectRange, connectRefinementList } from 'react-instantsearch-dom';
import { Form, Dropdown, Badge } from 'react-bootstrap';
import { add, formatISO, isAfter } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateDate } from 'utils/date';
import { Highlight } from 'react-instantsearch-dom';

const RangeInput = ({ faIcon, listLabel, faClasses, currentRefinement: { min, max }, refine }) => {
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

  return (
    <Dropdown className="d-inline mx-2" autoClose="outside">
      <Dropdown.Toggle>
        <FontAwesomeIcon icon={faIcon} className={faClasses} />
        {` ${listLabel}`}
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

const CustomRangeInput = connectRange(RangeInput);

const StyledRefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  placeholder,
  listLabel,
  faIcon,
  faClasses,
}) => (
  <Dropdown className="d-inline mx-2" autoClose="outside">
    <Dropdown.Toggle>
      <FontAwesomeIcon icon={faIcon} className={faClasses} />
      {` ${listLabel}`}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Form className="px-3" onSubmit={(e) => e.preventDefault()}>
        <Form.Control
          type="search"
          placeholder={placeholder}
          onChange={(event) => searchForItems(event.currentTarget.value)}
        />
      </Form>
      <Dropdown.Divider />
      {items.map((item) => (
        <Dropdown.Item
          key={item.label}
          active={item.isRefined}
          onClick={() => {
            refine(item.value);
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            {isFromSearch ? <Highlight attribute="label" hit={item} /> : item.label}&nbsp;
            <Badge>{item.count}</Badge>
          </div>
        </Dropdown.Item>
      ))}
      {items.length === 0 && <div className="d-flex justify-content-center">No result</div>}
    </Dropdown.Menu>
  </Dropdown>
);

const RefinementList = connectRefinementList(StyledRefinementList);

function Filters() {
  return REFINEMENT_LISTS.map((list) => {
    if (list.attribute === 'epoch_incident_date' || list.attribute === 'epoch_date_published') {
      return (
        <CustomRangeInput
          key={list.attribute}
          attribute={list.attribute}
          listLabel={list.label}
          faIcon={list.faIcon}
          faClasses={list.faClasses}
        />
      );
    }
    return (
      <RefinementList
        key={list.attribute}
        attribute={list.attribute}
        placeholder={list.inputText}
        listLabel={list.label}
        faIcon={list.faIcon}
        faClasses={list.faClasses}
      />
    );
  });
}

export default Filters;
