import React from 'react';
import styled from 'styled-components';
import { connectRefinementList, Highlight } from 'react-instantsearch-dom';
import { Form, Badge, OverlayTrigger, Button, Card, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListGroupScrollable = styled(ListGroup)`
  max-height: 400px;
  overflow-y: scroll;
`;

const RefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  placeholder,
  label,
  faIcon,
  faClasses,
  className,
}) => {
  const refinementCount = items.reduce((total, item) => (item.isRefined ? total + 1 : total), 0);

  const touched = refinementCount > 0;

  return (
    <OverlayTrigger
      trigger="click"
      rootClose={true}
      placement="bottom-start"
      overlay={
        <Card style={{ width: '32rem' }} className="shadow-lg">
          <Card.Body>
            <Card.Title></Card.Title>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="search"
                placeholder={placeholder}
                onChange={(event) => searchForItems(event.currentTarget.value)}
              />
            </Form>

            <ListGroupScrollable className="mt-4 border">
              {items.map((item) => (
                <ListGroup.Item
                  action
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
                </ListGroup.Item>
              ))}

              <ListGroup.Item key="no-results">
                {items.length === 0 && (
                  <div className="d-flex justify-content-center">No result</div>
                )}
              </ListGroup.Item>
            </ListGroupScrollable>
          </Card.Body>
        </Card>
      }
    >
      <Button className={className} variant={touched ? 'success' : 'primary'}>
        <FontAwesomeIcon icon={faIcon} className={faClasses} />
        &nbsp; {label} &nbsp;{' '}
        {refinementCount > 0 && (
          <Badge bg="light" text="dark">
            {refinementCount}
          </Badge>
        )}
      </Button>
    </OverlayTrigger>
  );
};

export default connectRefinementList(styled(RefinementList)``);
