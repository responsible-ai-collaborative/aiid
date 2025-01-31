import EntityCard from 'components/entities/EntityCard';
import IncidentCard from 'components/incidents/IncidentCard';
import Link from 'components/ui/Link';
import { useUserContext } from 'contexts/UserContext';
import { Button, Spinner } from 'flowbite-react';
import { graphql } from 'gatsby';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { computeEntities, makeEntitiesHash, makeIncidentsHash } from 'utils/entities';
import HeadContent from 'components/HeadContent';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import {
  DELETE_SUBSCRIPTIONS,
  FIND_USER_SUBSCRIPTIONS,
  UPSERT_SUBSCRIPTION,
} from '../graphql/subscriptions';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import Label from '../components/forms/Label';

const sortByReports = (a, b) => b.reports.length - a.reports.length;

const incidentFields = [
  'incidentsAsBoth',
  'incidentsAsDeployer',
  'incidentsAsDeveloper',
  'incidentsHarmedBy',
  'incidentsImplicatedSystems',
];

const EntityPage = ({ pageContext, data, ...props }) => {
  const { id, name, relatedEntities, entityRelationships } = pageContext;

  const { isRole, user } = useUserContext();

  const addToast = useToastContext();

  const localizePath = useLocalizePath();

  const { i18n, t } = useTranslation();

  const {
    incidentsAsDeployer,
    incidentsAsDeveloper,
    incidentsAsBoth,
    incidentsHarmedBy,
    incidentsImplicatedSystems,
    entities: entitiesData,
    responses,
  } = data;

  const entityIncidents = {
    incidentsAsBoth: incidentsAsBoth.nodes.sort(sortByReports),
    incidentsHarmedBy: incidentsHarmedBy.nodes.sort(sortByReports),
    incidentsAsDeveloper: incidentsAsDeveloper.nodes.sort(sortByReports),
    incidentsAsDeployer: incidentsAsDeployer.nodes.sort(sortByReports),
    incidentsImplicatedSystems: incidentsImplicatedSystems.nodes.sort(sortByReports),
  };

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
    {
      header: 'Incidents implicated systems',
      key: 'incidentsImplicatedSystems',
    },
  ];

  const incidents = sections.reduce((array, s) => array.concat(entityIncidents[s.key]), []);

  const entities = computeEntities({
    incidents,
    entities: entitiesData.nodes,
    responses: responses.nodes,
  });

  const incidentsHash = makeIncidentsHash(incidents);

  const entitiesHash = makeEntitiesHash(entities);

  const relatedEntitiesData = relatedEntities.map((id) => {
    const entity = { ...entitiesHash[id] };

    for (const field of incidentFields) {
      entity[field] = entity[field]
        .map((id) => incidentsHash[id])
        .sort((a, b) => b.reports.length - a.reports.length);
    }

    return entity;
  });

  const entityRelationshipsData = entityRelationships
    .filter((rel) => rel.sub === id || rel.obj === id)
    .map((rel) => {
      const relatedId = rel.sub === id ? rel.obj : rel.sub;

      const entity = entitiesData?.nodes?.find((entity) => entity.entity_id === relatedId);

      return { ...entity, id: relatedId };
    });

  const [subscribeToEntityMutation, { loading: subscribing }] = useMutation(UPSERT_SUBSCRIPTION);

  const [unsubscribeToEntityMutation, { loading: unsubscribing }] =
    useMutation(DELETE_SUBSCRIPTIONS);

  const {
    data: subscriptions,
    loading: loadingSubscription,
    refetch: refetchSubscription,
    networkStatus: subscriptionNetworkStatus,
  } = useQuery(FIND_USER_SUBSCRIPTIONS, {
    variables: {
      filter: {
        type: { EQ: SUBSCRIPTION_TYPE.entity },
        userId: { EQ: user?.id },
        entityId: { EQ: id },
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const subscribeToEntity = async () => {
    if (isRole('subscriber')) {
      try {
        await subscribeToEntityMutation({
          variables: {
            filter: {
              type: { EQ: SUBSCRIPTION_TYPE.entity },
              userId: { EQ: user.id },
              entityId: { EQ: id },
            },
            update: {
              type: SUBSCRIPTION_TYPE.entity,
              userId: { link: user.id },
              entityId: { link: id },
            },
          },
        });

        await refetchSubscription();

        addToast({
          message: (
            <>
              {t(`You have successfully subscribed to new {{name}} incidents`, {
                name,
              })}
            </>
          ),
          severity: SEVERITY.success,
        });
      } catch (e) {
        console.log(e);
        addToast({
          message: <label>{t(e.error || 'An unknown error has occurred')}</label>,
          severity: SEVERITY.danger,
          error: e,
        });
      }
    } else {
      addToast({
        message: (
          <Trans i18n={i18n}>
            Please{' '}
            <Link to={localizePath({ path: `/login?redirectTo=${props?.location?.pathname}` })}>
              log in
            </Link>{' '}
            to subscribe
          </Trans>
        ),
        severity: SEVERITY.success,
      });
    }
  };

  const unsubscribeToEntity = async () => {
    try {
      await unsubscribeToEntityMutation({
        variables: {
          filter: {
            type: { EQ: SUBSCRIPTION_TYPE.entity },
            userId: { EQ: user.id },
            entityId: { EQ: id },
          },
        },
      });

      await refetchSubscription();

      addToast({
        message: (
          <>
            {t(`You have successfully unsubscribed to new {{name}} incidents`, {
              name,
            })}
          </>
        ),
        severity: SEVERITY.success,
      });
    } catch (e) {
      console.log(e);
      addToast({
        message: <label>{t(e.error || 'An unknown error has occurred')}</label>,
        severity: SEVERITY.danger,
        error: e,
      });
    }
  };

  return (
    <>
      <div className="titleWrapper">
        <LocalizedLink to="/entities" className="text-lg">
          <Trans ns="entities">Entities</Trans>
        </LocalizedLink>
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <h1>{name}</h1>
          <div className="flex items-center">
            {loadingSubscription && subscriptionNetworkStatus === NetworkStatus.loading ? (
              <Spinner size="sm" />
            ) : subscriptions?.subscriptions.length > 0 ? (
              <UnsubscribeButton
                {...{
                  unsubscribeToEntity,
                  unsubscribing,
                  subscriptionNetworkStatus,
                  entityName: name,
                }}
              >
                <Trans>Unfollow</Trans>
              </UnsubscribeButton>
            ) : (
              <NotifyButton
                {...{ subscribeToEntity, subscribing, subscriptionNetworkStatus, entityName: name }}
              >
                <Trans>Follow</Trans>
              </NotifyButton>
            )}
            {subscriptionNetworkStatus != NetworkStatus.loading && isRole('admin') && (
              <Button
                className="hover:no-underline ml-2"
                color="light"
                href={localizePath({ path: `/entities/edit?entity_id=${id}` })}
                data-cy="edit-entity-btn"
              >
                <FontAwesomeIcon className="mr-2" icon={faEdit} title={t('Edit Entity')} />
                <Trans>Edit</Trans>
              </Button>
            )}
          </div>
        </div>
      </div>

      {sections.map((section) => {
        const [open, setOpen] = useState(false);

        const visible = 4;

        const hidden = entityIncidents[section.key].length - visible;

        return (
          <div key={section.header}>
            {entityIncidents[section.key].length > 0 && (
              <>
                <h2 className="mt-8">
                  <Trans ns="entities">{section.header}</Trans>
                </h2>
                <div className="grid gap-4 grid-flow-row-dense md:grid-cols-2 mt-6">
                  {entityIncidents[section.key].map((incident, index) => {
                    if (index >= visible && !open) {
                      return null;
                    }

                    return <IncidentCard key={incident.incident_id} incident={incident} />;
                  })}
                </div>
                {entityIncidents[section.key].length > 3 && (
                  <button
                    onClick={() => setOpen((open) => !open)}
                    className="text-blue-700 border mt-4 ml-1 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2  dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
                  >
                    {open ? <Trans>View Less</Trans> : <Trans>View ({{ hidden }}) more</Trans>}
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}

      {relatedEntitiesData.length > 0 && (
        <>
          <h2 className="mt-24">
            <Label popover="relatedEntities" label={t('Related Entities')} className="text-2xl" />
          </h2>
          <div className="grid gap-4 grid-flow-row-dense md:grid-cols-2 mt-6">
            {relatedEntitiesData.map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </>
      )}

      {entityRelationshipsData && entityRelationshipsData?.length > 0 && (
        <>
          <h2 className="mt-24">
            <Label
              popover="entityRelationships"
              label={t('Entity Relationships')}
              className="text-2xl"
            />
          </h2>
          <div className="grid gap-4 grid-flow-row-dense md:grid-cols-2 mt-6">
            {entityRelationshipsData.map((entity) => (
              <EntityCard key={entity.entity_id} entity={entity} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
    pageContext: { name },
  } = props;

  const metaTitle = 'Entity: ' + name;

  const metaDescription = 'Information about ' + name + ' and its involvement in AI incidents.';

  return <HeadContent path={pathname} {...{ metaTitle, metaDescription }} />;
};

function UnsubscribeButton({
  children,
  unsubscribeToEntity,
  unsubscribing,
  subscriptionNetworkStatus,
  entityName,
}) {
  const { t } = useTranslation();

  return (
    <Button
      onClick={unsubscribeToEntity}
      color="light"
      disabled={unsubscribing || subscriptionNetworkStatus === NetworkStatus.refetch}
      className="mr-1"
      title={t('Unsubscribe from New {{name}} Incidents', { name: entityName })}
    >
      <div className="flex gap-2 items-center">
        {unsubscribing || subscriptionNetworkStatus === NetworkStatus.refetch ? (
          <div>
            <Spinner size="sm" />
          </div>
        ) : (
          <FontAwesomeIcon icon={faEnvelope} title={t('Cancel Subscription')} />
        )}
        {children}
      </div>
    </Button>
  );
}

function NotifyButton({
  children,
  subscribeToEntity,
  subscribing,
  subscriptionNetworkStatus,
  entityName,
}) {
  const { t } = useTranslation();

  return (
    <Button
      color="light"
      onClick={subscribeToEntity}
      disabled={subscribing || subscriptionNetworkStatus === NetworkStatus.refetch}
      className="mr-2 whitespace-nowrap"
      title={t('Notify Me of New {{name}} Incidents', { name: entityName })}
    >
      <div className="flex gap-2 items-center">
        {subscribing || subscriptionNetworkStatus === NetworkStatus.refetch ? (
          <div>
            <Spinner size="sm" />
          </div>
        ) : (
          <FontAwesomeIcon icon={faEnvelope} />
        )}
        {children}
      </div>
    </Button>
  );
}

export const query = graphql`
  query EntityPageQuery(
    $incidentsAsDeployer: [Int]
    $incidentsAsDeveloper: [Int]
    $incidentsAsBoth: [Int]
    $incidentsHarmedBy: [Int]
    $incidentsImplicatedSystems: [Int]
  ) {
    incidentsAsDeployer: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsDeployer } }
    ) {
      nodes {
        title
        description
        incident_id
        reports {
          report_number
        }
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
        implicated_systems
      }
    }

    incidentsAsDeveloper: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsDeveloper } }
    ) {
      nodes {
        title
        description
        incident_id
        reports {
          report_number
        }
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
        implicated_systems
      }
    }

    incidentsAsBoth: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsAsBoth } }
    ) {
      nodes {
        title
        description
        incident_id
        reports {
          report_number
        }
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
        implicated_systems
      }
    }

    incidentsHarmedBy: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsHarmedBy } }
    ) {
      nodes {
        title
        description
        incident_id
        reports {
          report_number
        }
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
        implicated_systems
      }
    }

    incidentsImplicatedSystems: allMongodbAiidprodIncidents(
      filter: { incident_id: { in: $incidentsImplicatedSystems } }
    ) {
      nodes {
        title
        description
        incident_id
        reports {
          report_number
        }
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
        implicated_systems
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
`;
export default EntityPage;
