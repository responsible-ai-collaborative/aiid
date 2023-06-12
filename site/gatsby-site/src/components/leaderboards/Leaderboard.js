import React from 'react';
import { Link } from 'gatsby';
import { Trans } from 'react-i18next';
import { Badge } from 'flowbite-react';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';

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

export const Leaderboard = ({ dataHash, leaderboard: { attribute, title }, limit, className }) => {
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
    <div className={`max-w-full md:max-w-sm flex-1 self-stretch ${className || ''}`}>
      <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col w-full max-h-[400px]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 hover:bg-gray-100 dark:hover:bg-gray-700">
          <LocalizedLink to={`/summaries/leaderboard`} className="hover:no-underline">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              <Trans ns="landing">{title}</Trans>
            </h5>
          </LocalizedLink>
        </div>
        <div className="flow-root overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedArray.map((item, index) => (
              <li
                className="py-3 sm:py-4 list-none px-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                key={`${item.label}-${item.value}`}
                data-cy="leaderboard-item"
              >
                <Link
                  to={`/apps/discover?${item.attribute}=${item.label}`}
                  className="hover:no-underline"
                >
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <div className="inline-block pr-2">{medalMap(index + 1)}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-w  hite mb-0 my-0">
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
      </div>
    </div>
  );
};
