import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { computeEntities } from 'utils/entities';
import { Card } from 'flowbite-react';
import { Trans } from 'react-i18next';
import Link from 'components/ui/Link';
import facebook from '../../images/facebook.svg';
import google from '../../images/google.svg';
import tesla from '../../images/tesla.svg';
import amazon from '../../images/amazon.svg';
import youtube from '../../images/youtube.svg';

export default function CommonEntities() {
  const {
    incidents,
    entities: entitiesData,
    responses,
  } = useStaticQuery(graphql`
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
      entities: allMongodbAiidprodEntities {
        nodes {
          entity_id
          name
        }
      }
      responses: allMongodbAiidprodReports(filter: { tags: { in: ["response"] } }) {
        nodes {
          report_number
        }
      }
    }
  `);

  const commonEntities = useMemo(
    () =>
      computeEntities({
        incidents: incidents.nodes,
        entities: entitiesData.nodes,
        responses: responses.nodes,
      })
        .sort(
          (a, b) =>
            b.incidentsAsBoth.length +
            b.incidentsAsDeployer.length -
            (a.incidentsAsBoth.length + a.incidentsAsDeployer.length)
        )
        .slice(0, 3),
    [incidents.nodes]
  );

  return (
    <Card data-cy="common-entities">
      <div className="flex justify-between">
        <h2 className="font-bold">
          <Trans ns="entities">Common Entities</Trans>
        </h2>
        <Link to="/entities" ns="entities">
          <Trans ns="entities">View all entities</Trans>
        </Link>
      </div>
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {commonEntities.map((entity, index) => {
          const incidentsCount = entity.incidentsAsBoth.length + entity.incidentsAsDeployer.length;

          const harmedCount = entity.harmedEntities.length;

          const responsesCount = entity.responses.length;

          return (
            <Link
              key={entity.id}
              to={`/entities/${entity.id}`}
              className="
                p-4 gap-4 
                bg-white dark:bg-gray-800
                hover:bg-gray-100 dark:hover:bg-gray-700
                rounded-lg 
                border border-gray-200 dark:border-gray-700 
                flex 
                lg:flex-col
                xl:flex-row 
                relative
              "
            >
              <div className="shrink-0 w-1/4 lg:w-full xl:w-1/4">
                <img
                  className="
                    mx-auto 
                    w-28 h-auto 
                    lg:w-auto lg:h-28
                    xl:w-full xl:h-auto
                  "
                  alt=""
                  src={
                    {
                      Google: google,
                      Facebook: facebook,
                      Tesla: tesla,
                      YouTube: youtube,
                      Amazon: amazon,
                    }[entity.name]
                  }
                />
              </div>
              <div className="w-full">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {index + 1}.&nbsp;{entity.name}
                </h5>
                <ul className="text-black dark:text-white">
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
                      entities,
                    </Trans>
                  </li>
                  <li>
                    <Trans ns="entities">
                      with{' '}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {{ responsesCount }}
                      </span>{' '}
                      incident responses.
                    </Trans>
                  </li>
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
