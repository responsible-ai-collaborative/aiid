import Link from 'components/ui/Link';
import React from 'react';

export default function EntityCard({ entity, className = '', ...props }) {
  return (
    <Link
      className={`tw-block tw-p-6 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-shadow-md hover:tw-bg-gray-100 ${className}`}
      to={`/entities/${entity.id}`}
      {...props}
    >
      <h5 className="tw-mb-2 tw-font-bold tw-tracking-tight tw-text-gray-900 tw-dark:text-white">
        {entity.name}
      </h5>
      <div className="tw-inline-block tw-bg-red-100 tw-text-red-800 tw-text-xs tw-font-semibold tw-mr-2 tw-px-2.5 tw-py-0.5 tw-rounded tw-dark:bg-green-200 tw-dark:text-green-900">
        {entity.incidents} Incident(s)
      </div>
    </Link>
  );
}
