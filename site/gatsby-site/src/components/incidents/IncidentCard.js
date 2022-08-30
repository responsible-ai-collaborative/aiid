import Link from 'components/ui/Link';
import React from 'react';

export default function IncidentCard({ incident, className = '', ...props }) {
  return (
    <div
      className={`tw-p-6 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-shadow-md tw-dark:bg-gray-800 tw-dark:border-gray-700 ${className}`}
      {...props}
    >
      <Link to={`/cite/${incident.incident_id}`}>
        <h4 className="tw-mb-2 tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 tw-dark:text-white">
          <span className="tw-text-sm">Incident {incident.incident_id}</span>
          <br />
          {incident.title}
        </h4>
      </Link>
      <p className="tw-font-normal tw-text-gray-700 tw-dark:text-gray-400">
        {incident.description}
      </p>

      <Link
        to={`/cite/${incident.incident_id}`}
        href="#"
        className="tw-inline-flex tw-items-center tw-py-2 tw-px-3 tw-text-sm tw-font-medium tw-text-center tw-text-white tw-bg-blue-700 tw-rounded-lg tw-hover:bg-blue-800 tw-focus:ring-4 tw-focus:outline-none tw-focus:ring-blue-300 tw-dark:bg-blue-600 tw-dark:hover:bg-blue-700 tw-dark:focus:ring-blue-800"
      >
        Learn more
        <svg
          aria-hidden="true"
          className="tw-ml-2 tw-mr-1 tw-w-4 tw-h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </Link>
    </div>
  );
}
