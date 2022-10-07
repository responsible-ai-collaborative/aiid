import Link from 'components/ui/Link';
import React from 'react';
import { Trans } from 'react-i18next';

export default function IncidentCard({ incident, className = '', ...props }) {
  return (
    <div
      className={`p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 ${className}`}
      {...props}
    >
      <Link to={`/cite/${incident.incident_id}`} className="hover:underline">
        <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <span className="text-sm">
            <Trans>Incident {{ id: incident.incident_id }}</Trans>
          </span>
          <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
            <Trans ns="entities" count={incident.reports.length}>
              {{ count: incident.reports.length }} Report
            </Trans>
          </span>
          <br />
          {incident.title}
        </h4>
      </Link>

      <p>{incident.date}</p>
      <p className="font-normal text-gray-700 dark:text-gray-400">{incident.description}</p>

      <Link
        to={`/cite/${incident.incident_id}`}
        href="#"
        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <Trans>More</Trans>
        <svg
          aria-hidden="true"
          className="ml-2 mr-1 w-4 h-4"
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
