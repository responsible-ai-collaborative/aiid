import React from 'react';
import { Badge, ListGroup } from 'react-bootstrap';

const Wordlist = ({ content }) => {
  return (
    <>
      <ListGroup>
        {content.map((value) => (
          <ListGroup.Item key={`word-${value[0]}`}>
            {value[0]} <Badge bg="secondary"> {value[1]} </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default Wordlist;
