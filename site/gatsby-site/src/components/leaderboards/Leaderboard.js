import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import Badge from 'react-bootstrap/Badge';
import { Card, ListGroup } from 'react-bootstrap';

const medalMap = (position) => {
  switch (position) {
    case 1:
      return (
        <span role="img" aria-label="Gold medal">
          🥇
        </span>
      );
    case 2:
      return (
        <span role="img" aria-label="Silver medal">
          🥈
        </span>
      );
    case 3:
      return (
        <span role="img" aria-label="Bronze medal">
          🥉
        </span>
      );
    default:
      return <span>{position}.</span>;
  }
};

const Medal = styled.div`
  display: inline-block;
`;

export const Leaderboard = ({ dataHash, leaderboard: { attribute, title }, limit }) => {
  let sortedArray = [];

  for (const item in dataHash) {
    sortedArray.push({
      label: dataHash[item].fieldValue,
      value: dataHash[item].totalCount,
      attribute,
    });
  }

  sortedArray = sortedArray.sort((a, b) => {
    return b.value - a.value;
  });

  if (limit && limit > 0) {
    sortedArray = sortedArray.splice(0, limit);
  }

  return (
    <Card>
      <Card.Header>{title}</Card.Header>
      <ListGroup variant="flush">
        {sortedArray.map((item, index) => (
          <ListGroup.Item key={`${item.label}-${item.value}`}>
            <Medal className="p-2">{medalMap(index + 1)}</Medal>
            <Link to={`/apps/discover?${item.attribute}=${item.label}`}>
              {item.label} <Badge>{item.value}</Badge>
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};
