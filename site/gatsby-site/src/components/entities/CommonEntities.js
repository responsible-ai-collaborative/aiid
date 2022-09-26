import React, { useRef } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { computeEntities } from 'utils/entities';
import Card from 'elements/Card';
import { Trans } from 'react-i18next';
import Link from 'components/ui/Link';

export default function CommonEntities() {
  const { incidents } = useStaticQuery(graphql`
    {
      incidents: allMongodbAiidprodIncidents {
        nodes {
          incident_id
          reports
          title
          description
          Alleged_deployer_of_AI_system
          Alleged_developer_of_AI_system
          Alleged_harmed_or_nearly_harmed_parties
        }
      }
    }
  `);

  const commonEntities = useRef(
    computeEntities({ incidents: incidents.nodes })
      .sort(
        (a, b) =>
          b.incidentsAsBoth.length +
          b.incidentsAsDeployer.length -
          (a.incidentsAsBoth.length + a.incidentsAsDeployer.length)
      )
      .slice(0, 3)
  ).current;

  return (
    <Card data-cy="common-entities">
      <div className="flex justify-between p-4">
        <h2>
          <Trans ns="entities">Common Entities</Trans>
        </h2>
        <Link to="/entities" ns="entities">
          <Trans ns="entities">View all entities</Trans>
        </Link>
      </div>
      <Card.Body className="pt-0">
        <div className="grid sm:grid-cols-3 gap-2">
          {commonEntities.map((entity, index) => {
            const incidentsCount =
              entity.incidentsAsBoth.length + entity.incidentsAsDeployer.length;

            const harmedCount = entity.harmedEntities.length;

            return (
              <div
                key={entity.id}
                className="p-6 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              >
                <Link to={`/entities/${entity.id}`}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {' '}
                    {index + 1}. {entity.name}
                  </h5>
                </Link>
                <ul className="list-none">
                  <li>
                    <Trans ns="entities">
                      Involved in{' '}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {{ incidentsCount }}
                      </span>{' '}
                      incidents,
                    </Trans>
                  </li>
                  <li>
                    <Trans ns="entities">
                      allegedly harming{' '}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {{ harmedCount }}
                      </span>{' '}
                      entities.
                    </Trans>
                  </li>
                </ul>
                <Link
                  className="mt-4 inline-flex items-center py-2 px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  to={`/entities/${entity.id}`}
                >
                  <Trans>More</Trans>
                  <svg
                    aria-hidden="true"
                    className="ml-2 -mr-1 w-4 h-4"
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
          })}
        </div>
      </Card.Body>
    </Card>
  );
}
