import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import { Badge, Card } from 'flowbite-react';

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
    <div className="max-w-sm flex-1-1-auto">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            <Trans ns="landing">{title}</Trans>
          </h5>
          <a
            href="/summaries/leaderboard"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            <Trans>View all</Trans>
          </a>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedArray.map((item, index) => (
              <li
                className="py-3 sm:py-4"
                key={`${item.label}-${item.value}`}
                data-cy="leaderboard-item"
              >
                <Link to={`/apps/discover?${item.attribute}=${item.label}`}>
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <Medal className="pe-2">{medalMap(index + 1)}</Medal>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white mb-0">
                        {item.label}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <Badge color="info">{item.value}</Badge>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};
