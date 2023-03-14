import Link from 'components/ui/Link';
import React, { Fragment, useState } from 'react';
import { Trans } from 'react-i18next';

const sortByReports = (a, b) => b.reports.length - a.reports.length;

export default function EntityCard({ entity, ...props }) {
  const sections = [
    {
      header: 'Incidents involved as both Developer and Deployer',
      key: 'incidentsAsBoth',
    },
    {
      header: 'Incidents Harmed By',
      key: 'incidentsHarmedBy',
    },
    {
      header: 'Incidents involved as Developer',
      key: 'incidentsAsDeveloper',
    },
    {
      header: 'Incidents involved as Deployer',
      key: 'incidentsAsDeployer',
    },
  ];

  return (
    <div
      key={entity.id}
      className={`mt-6 p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700`}
      {...props}
    >
      <Link to={`/entities/${entity.id}`} className="hover:underline">
        <span className="text-sm text-black dark:text-white">
          <Trans>Entity</Trans>
        </span>
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {entity.name}
        </h3>
      </Link>

      <div>
        {sections
          .filter((section) => entity[section.key].length)
          .map((section) => {
            const [open, setOpen] = useState(false);

            const visible = 2;

            const hidden = entity[section.key].length - visible;

            return (
              <Fragment key={section.key}>
                <h5 className="mt-6">
                  <Trans ns="entities">{section.header}</Trans>
                </h5>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 list-none">
                  {entity[section.key].sort(sortByReports).map((incident, index) => {
                    if (index >= visible && !open) {
                      return null;
                    }

                    return (
                      <li key={incident.incident_id} className="py-3 sm:py-4">
                        <Link
                          to={`/cite/${incident.incident_id}`}
                          className="tracking-tight text-gray-900 dark:text-white hover:underline"
                        >
                          <div className="m-0">
                            <div className="inline-block text-muted-gray">
                              <Trans>Incident {{ id: incident.incident_id }}</Trans>
                            </div>
                            <div className="ml-2 inline-block bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                              <Trans count={incident.reports.length} ns="entities">
                                {{ count: incident.reports.length }} Report
                              </Trans>
                            </div>
                          </div>
                          <p className="mt-1 mb-0 text-md">{incident.title}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {entity[section.key].length > 3 && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setOpen((open) => !open)}
                      className="text-blue-700 border hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2  dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
                    >
                      {open ? <Trans>View Less</Trans> : <Trans>View ({{ hidden }}) more</Trans>}
                    </button>
                  </div>
                )}
              </Fragment>
            );
          })}
      </div>

      <Link
        to={`/entities/${entity.id}`}
        href="#"
        className="inline-flex mt-4 items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
