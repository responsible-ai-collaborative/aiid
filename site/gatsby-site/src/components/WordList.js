import React from 'react';
import { Badge, ListGroup } from 'react-bootstrap';

const Wordlist = ({ content }) => {
  return (
    <div className="bootstrap">
      <ListGroup>
        {content.map((value) => (
          <ListGroup.Item key={`word-${value[0]}`} className="flex justify-between items-center">
            {value[0]} <Badge bg="secondary"> {value[1]} </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Wordlist;
