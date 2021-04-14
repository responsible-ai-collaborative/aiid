import React from 'react';
import { Link } from 'gatsby';

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
    <>
      <h1 className="heading1">{title}</h1>
      <ul>
        {sortedArray.map((item) => (
          <li key={`${item.label}-${item.value}`}>
            <Link to={`/apps/discover?${item.attribute}=${item.label}`}>
              {`${item.label}: ${item.value}`}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
