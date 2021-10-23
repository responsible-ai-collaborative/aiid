import React, { useState, useEffect } from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { debounce } from 'debounce';
import { connectRange, connectRefinementList } from 'react-instantsearch-dom';
import { Form } from 'react-bootstrap';
import { add, formatISO, isAfter } from 'date-fns';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { validateDate } from 'utils/date';
import { Highlight } from 'react-instantsearch-dom';

const RangeInputContainer = styled.div`
  padding-bottom: 1.5rem;
`;

const RefinementListContainer = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 10px;
`;

const RefinementListHeader = styled.span`
  display: block;
  background: #036eff;
  border-radius: 1px;
  color: #fff;
  margin-bottom: 0;
  padding: 10px;
`;

const StyledButton = styled.button`
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0rem;
  margin-top: 0rem !important;
  border: 1px solid transparent;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  :hover {
    color: #fff;
    background-color: #6bb3ff;
    border-color: #6bb3ff;
    text-decoration: none;
  }

  ${({ active }) =>
    active === true &&
    `
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  `};
`;

const RangeInput = ({ currentRefinement: { min, max }, refine }) => {
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
    <Form>
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
  );
};

const CustomRangeInput = connectRange(RangeInput);

const StyledRefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
  placeholder,
  listLabel,
  faIcon,
  faClasses,
}) => (
  <RefinementListContainer>
    <RefinementListHeader className="refine_header">
      <FontAwesomeIcon icon={faIcon} className={faClasses} />
      {` ${listLabel}`}
    </RefinementListHeader>
    {items.length === 0 && <div className="d-flex justify-content-center">No result</div>}
    {items.map((item) => (
      <StyledButton
        key={item.label}
        active={item.isRefined}
        href={createURL(item.value)}
        onClick={(event) => {
          event.preventDefault();
          refine(item.value);
        }}
      >
        {isFromSearch ? <Highlight attribute="label" hit={item} /> : item.label}
        <span className="badge bg-secondary badge-pill">{item.count}</span>
      </StyledButton>
    ))}
    <input
      className="form-control"
      type="search"
      placeholder={placeholder}
      onChange={(event) => searchForItems(event.currentTarget.value)}
    />
  </RefinementListContainer>
);

const RefinementList = connectRefinementList(StyledRefinementList);

function Filters() {
  return REFINEMENT_LISTS.map((list) => {
    if (list.attribute === 'epoch_incident_date' || list.attribute === 'epoch_date_published') {
      return (
        <RangeInputContainer key={list.attribute}>
          <RefinementListHeader className="refine_header">
            <FontAwesomeIcon icon={list.faIcon} className={list.faClasses} />
            {` ${list.label}`}
          </RefinementListHeader>
          <CustomRangeInput attribute={list.attribute} />
        </RangeInputContainer>
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
