import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import Badge from 'react-bootstrap/Badge';
import { Card, ListGroup } from 'react-bootstrap';
import { Trans } from 'react-i18next';

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

const StyledItem = styled(ListGroup.Item)`
  white-space: nowrap;
`;

export const Leaderboard = ({
  dataHash,
  leaderboard: { attribute, title },
  limit,
  className = '',
}) => {
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
    <Card className={className}>
      <Card.Header>
        <Trans ns="landing">{title}</Trans>
      </Card.Header>
      <ListGroup variant="flush">
        {sortedArray.map((item, index) => (
          <StyledItem
            key={`${item.label}-${item.value}`}
            className="d-flex justify-content-between align-items-center"
          >
            <Link to={`/apps/discover?${item.attribute}=${item.label}`}>
              <Medal className="pe-2">{medalMap(index + 1)}</Medal>
              {item.label}
            </Link>
            <Badge bg="secondary">{item.value}</Badge>
          </StyledItem>
        ))}
      </ListGroup>
    </Card>
  );
};
