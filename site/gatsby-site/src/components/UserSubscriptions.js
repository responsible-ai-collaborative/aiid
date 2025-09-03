import { ListGroup, Spinner, Button, ToggleSwitch, Badge } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import {
  DELETE_SUBSCRIPTION,
  FIND_USER_SUBSCRIPTIONS,
  UPSERT_SUBSCRIPTION,
} from '../graphql/subscriptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from 'contexts/UserContext';
import Link from 'components/ui/Link';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';

const UserSubscriptions = () => {
  const { user } = useUserContext();

  const { t } = useTranslation(['account']);

  const [incidentSubscriptions, setIncidentSubscriptions] = useState(null);

  const [entitySubscriptions, setEntitySubscriptions] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [isSubscribeToNewIncidents, setIsSubscribeToNewIncidents] = useState(false);

  const [isSubscribeToAiIncidentBriefing, setIsSubscribeToAiIncidentBriefing] = useState(false);

  const { data, loading } = useQuery(FIND_USER_SUBSCRIPTIONS, {
    variables: { filter: { userId: { EQ: user.id } } },
  });

  const [deleteSubscription, { loading: deletingSubscription }] = useMutation(DELETE_SUBSCRIPTION, {
    update(cache, { data }) {
      const deletedSubscription = data?.deleteOneSubscription;

      if (deletedSubscription && deletedSubscription._id) {
        cache.evict({
          id: cache.identify({ __typename: 'Subscription', _id: deletedSubscription._id }),
        });
        cache.gc();
      }
    },
  });

  function addSubscriptionToCache(cache, data) {
    const newSubscription = data?.upsertOneSubscription;

    if (!newSubscription) return;

    cache.modify({
      fields: {
        subscriptions(existingRefs = [], { readField, toReference }) {
          if (existingRefs.some((ref) => readField('_id', ref) === newSubscription._id)) {
            return existingRefs;
          }
          return [...existingRefs, toReference(newSubscription)];
        },
      },
    });
  }

  const [subscribeToNewIncidentsMutation, { loading: subscribingToNewIncidents }] = useMutation(
    UPSERT_SUBSCRIPTION,
    {
      update(cache, { data }) {
        addSubscriptionToCache(cache, data);
      },
    }
  );

  const [subscribeToAiIncidentBriefingMutation, { loading: subscribingToAiIncidentBriefing }] =
    useMutation(UPSERT_SUBSCRIPTION, {
      update(cache, { data }) {
        addSubscriptionToCache(cache, data);
      },
    });

  const handleDeleteSubscription = async (subscriptionId) => {
    if (confirm(t('Do you want to delete this subscription?'))) {
      setDeletingId(subscriptionId);

      await deleteSubscription({ variables: { filter: { _id: { EQ: subscriptionId } } } });

      const newIncidentSubscriptionList = incidentSubscriptions.filter(
        (subscription) =>
          subscription.type === SUBSCRIPTION_TYPE.incident && subscription._id !== subscriptionId
      );

      setIncidentSubscriptions(newIncidentSubscriptionList);

      const newEntitySubscriptionList = entitySubscriptions.filter(
        (subscription) =>
          subscription.type === SUBSCRIPTION_TYPE.entity && subscription._id !== subscriptionId
      );

      setEntitySubscriptions(newEntitySubscriptionList);

      setDeletingId(null);
    }
  };

  useEffect(() => {
    setIncidentSubscriptions(
      data?.subscriptions.filter(
        (subscription) =>
          subscription.type === SUBSCRIPTION_TYPE.incident && subscription.incident_id
      )
    );

    setEntitySubscriptions(
      data?.subscriptions.filter(
        (subscription) => subscription.type === SUBSCRIPTION_TYPE.entity && subscription.entityId
      )
    );

    const hasSubscription = data?.subscriptions.some(
      (s) => s.type == SUBSCRIPTION_TYPE.newIncidents
    );

    setIsSubscribeToNewIncidents(hasSubscription);

    let hasAiIncidentBriefingSubscription = data?.subscriptions.some(
      (s) => s.type == SUBSCRIPTION_TYPE.aiBriefing
    );

    setIsSubscribeToAiIncidentBriefing(hasAiIncidentBriefingSubscription);
  }, [user, data]);

  const onSusbcribeToggle = async (checked) => {
    if (checked) {
      await subscribeToNewIncidentsMutation({
        variables: {
          filter: {
            type: { EQ: SUBSCRIPTION_TYPE.newIncidents },
            userId: { EQ: user.id },
          },
          update: {
            type: SUBSCRIPTION_TYPE.newIncidents,
            userId: {
              link: user.id,
            },
          },
        },
      });
    } else {
      await deleteSubscription({
        variables: {
          filter: { type: { EQ: SUBSCRIPTION_TYPE.newIncidents }, userId: { EQ: user.id } },
        },
      });
    }
    setIsSubscribeToNewIncidents(checked);
  };

  const onSusbcribeAiIncidentBriefingToggle = async (checked) => {
    if (checked) {
      await subscribeToAiIncidentBriefingMutation({
        variables: {
          filter: { type: { EQ: SUBSCRIPTION_TYPE.aiBriefing }, userId: { EQ: user.id } },
          update: {
            type: SUBSCRIPTION_TYPE.aiBriefing,
            userId: { link: user.id },
          },
        },
      });
    } else {
      await deleteSubscription({
        variables: {
          filter: { type: { EQ: SUBSCRIPTION_TYPE.aiBriefing }, userId: { EQ: user.id } },
        },
      });
    }
    setIsSubscribeToAiIncidentBriefing(checked);
  };

  return (
    <div className="mt-4">
      <h3>{t('General Updates')}</h3>
      <div className={`mt-4 -ml-2 mb-6`}>
        <div className={`px-2`} data-testid="subscribe-ai-briefing">
          <div className="flex flex-row gap-2">
            <ToggleSwitch
              id="subscribe-ai-briefing"
              checked={isSubscribeToAiIncidentBriefing}
              label={t('Receive AI Incident Briefing', { ns: 'login' })}
              onChange={onSusbcribeAiIncidentBriefingToggle}
              name="subscribe-ai-briefing"
              disabled={loading || deletingSubscription || subscribingToAiIncidentBriefing}
            />
            <Badge>NEW</Badge>
          </div>
          <p className="text-sm text-gray-500">
            {t(
              'The AI Incident Briefing is a weekly digest of new incidents, blog posts, and other AIID updates.'
            )}
          </p>
        </div>
      </div>
      <div className="mt-4 mb-8" data-testid="subscribe-all">
        <ToggleSwitch
          id="subscribe-all"
          checked={isSubscribeToNewIncidents}
          label={t('Notify me of new Incidents')}
          onChange={onSusbcribeToggle}
          name="subscribe-all"
          disabled={loading || deletingSubscription || subscribingToNewIncidents}
        />
      </div>

      <h3>{t('Incident Updates')}</h3>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <Spinner />
          <Trans>Loading...</Trans>
        </div>
      ) : (
        <>
          <div className="mt-4 mb-8 text-sm text-gray-500">
            {incidentSubscriptions?.length > 0 ? (
              <ListGroup>
                {incidentSubscriptions
                  .map((subscription) => ({
                    id: subscription._id,
                    incidentId: subscription.incident_id.incident_id,
                    incidentTitle: subscription.incident_id.title,
                  }))
                  .sort((a, b) => a.incidentId - b.incidentId) // sort subscriptions by Incident ID ascendant
                  .map((subscription, index) => (
                    <div
                      className={`p-3 ${
                        index < incidentSubscriptions.length - 1 ? 'border-b' : ''
                      }`}
                      key={`subscription-${subscription.id}`}
                      data-cy="incident-subscription-item"
                    >
                      <div className="flex flex-row w-full justify-between gap-3 items-center">
                        <div className="items-center">
                          <Trans ns="account">Updates on incident </Trans>
                          <Link to={`/cite/${subscription.incidentId}`}>
                            #{subscription.incidentId}: {subscription.incidentTitle}
                          </Link>
                        </div>
                        <Button
                          size={'xs'}
                          color={'failure'}
                          disabled={deletingSubscription && deletingId === subscription.id}
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          data-cy="incident-delete-btn"
                        >
                          {deletingSubscription && deletingId === subscription.id ? (
                            <Spinner size={'xs'} />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
              </ListGroup>
            ) : (
              <Trans ns="account">
                You don&apos;t have active subscriptions to Incident updates
              </Trans>
            )}
          </div>
          <h3>{t('Entity Updates')}</h3>
          {entitySubscriptions?.length > 0 ? (
            <div className="mt-4">
              <ListGroup>
                {entitySubscriptions
                  .map((subscription) => ({
                    id: subscription._id,
                    entityId: subscription.entityId.entity_id,
                    entityName: subscription.entityId.name,
                  }))
                  .sort((a, b) => a.entityName - b.entityName) // sort subscriptions by Entity name ascendant
                  .map((subscription, index) => (
                    <div
                      className={`p-3 ${index < entitySubscriptions.length - 1 ? 'border-b' : ''}`}
                      key={`subscription-${subscription.id}`}
                      data-cy="entity-subscription-item"
                    >
                      <div className="flex flex-row w-full justify-between gap-3 items-center">
                        <div className="items-center">
                          <Trans ns="account">
                            New{' '}
                            <Link to={`/entities/${subscription.entityId}`}>
                              {{ name: subscription.entityName }}
                            </Link>{' '}
                            Entity incidents
                          </Trans>
                        </div>
                        <Button
                          size={'xs'}
                          color={'failure'}
                          disabled={deletingSubscription && deletingId === subscription.id}
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          data-cy="entity-delete-btn"
                        >
                          {deletingSubscription && deletingId === subscription.id ? (
                            <Spinner size={'xs'} />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
              </ListGroup>
            </div>
          ) : (
            <div className="mt-4 text-sm text-gray-500">
              <Trans ns="account">You don&apos;t have active subscriptions to Entities</Trans>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserSubscriptions;
