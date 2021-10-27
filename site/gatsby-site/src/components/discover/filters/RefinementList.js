import React from 'react';
import styled from 'styled-components';
import { connectRefinementList, Highlight } from 'react-instantsearch-dom';
import { Form, Dropdown, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  placeholder,
  label,
  faIcon,
  faClasses,
}) => (
  <Dropdown autoClose="outside">
    <Dropdown.Toggle>
      <FontAwesomeIcon icon={faIcon} className={faClasses} />
      {` ${label}`}
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
            <Badge bg="secondary">{item.count}</Badge>
          </div>
        </Dropdown.Item>
      ))}
      {items.length === 0 && <div className="d-flex justify-content-center">No result</div>}
    </Dropdown.Menu>
  </Dropdown>
);

export default connectRefinementList(styled(RefinementList)``);
