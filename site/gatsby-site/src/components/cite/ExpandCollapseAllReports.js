import React from 'react';
import { Trans } from 'react-i18next';

const ExpandCollapseAllReports = ({
  onExpandAll,
  onCollapseAll,
  hasReports = true,
  allExpanded = false,
  allCollapsed = false,
}) => {
  if (!hasReports) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        onClick={onExpandAll}
        disabled={allExpanded}
        className={`text-blue-700 border ml-1 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2 bg-white dark:text-blue-500 dark:focus:ring-blue-800 ${
          allExpanded
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white'
        }`}
        data-cy="expand-all-reports"
        aria-label={allExpanded ? 'All reports are already expanded' : 'Expand all reports'}
      >
        <Trans>Expand All</Trans>
        <svg
          aria-hidden="true"
          className="ml-2 -mr-1 w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <button
        onClick={onCollapseAll}
        disabled={allCollapsed}
        className={`text-blue-700 border ml-1 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2 bg-white dark:text-blue-500 dark:focus:ring-blue-800 ${
          allCollapsed
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white'
        }`}
        data-cy="collapse-all-reports"
        aria-label={allCollapsed ? 'All reports are already collapsed' : 'Collapse all reports'}
      >
        <Trans>Collapse All</Trans>
        <svg
          aria-hidden="true"
          className="ml-2 -mr-1 w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default ExpandCollapseAllReports;
