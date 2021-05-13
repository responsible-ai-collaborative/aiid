import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import Badge from 'react-bootstrap/Badge';

const StyledLi = styled.li`
  margin-left: 1em;
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
    <div>
      <h2>
        <Badge variant="secondary">{title}</Badge>
      </h2>
      <ol>
        {sortedArray.map((item) => (
          <StyledLi key={`${item.label}-${item.value}`}>
            <Link to={`/apps/discover?${item.attribute}=${item.label}`}>
              {`${item.label}: ${item.value}`}
            </Link>
          </StyledLi>
        ))}
      </ol>
    </div>
  );
};
