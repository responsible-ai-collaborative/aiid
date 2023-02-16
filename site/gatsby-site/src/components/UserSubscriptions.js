import { ListGroup, Spinner, Button, ToggleSwitch } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import {
  DELETE_SUBSCRIPTIONS,
  FIND_USER_SUBSCRIPTIONS,
  UPSERT_SUBSCRIPTION,
} from '../graphql/subscriptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from 'contexts/userContext';
import Link from 'components/ui/Link';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';

const UserSubscriptions = () => {
  const { user } = useUserContext();

  const { t } = useTranslation(['account']);

  const [incidentSubscriptions, setIncidentSubscriptions] = useState(null);

  const [entitySubscriptions, setEntitySubscriptions] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [isSubscribeToNewIncidents, setIsSubscribeToNewIncidents] = useState(false);

  const { data, loading } = useQuery(FIND_USER_SUBSCRIPTIONS, {
    variables: { query: { userId: { userId: user.id } } },
  });

  const [deleteSubscriptions, { loading: deleting }] = useMutation(DELETE_SUBSCRIPTIONS);

  const [subscribeToNewIncidentsMutation, { loading: subscribingToNewIncidents }] =
    useMutation(UPSERT_SUBSCRIPTION);

  const handleDeleteSubscription = async (subscriptionId) => {
    if (confirm(t('Do you want to delete this subscription?'))) {
      setDeletingId(subscriptionId);

      await deleteSubscriptions({ variables: { query: { _id: subscriptionId } } });

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
      data?.subscriptions.filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.incident)
    );

    setEntitySubscriptions(
      data?.subscriptions.filter((subscription) => subscription.type === SUBSCRIPTION_TYPE.entity)
    );

    const hasSubscription = data?.subscriptions.some(
      (s) => s.type == SUBSCRIPTION_TYPE.newIncidents
    );

    setIsSubscribeToNewIncidents(hasSubscription);
  }, [user, data]);

  const onSusbcribeToggle = async (checked) => {
    if (checked) {
      await subscribeToNewIncidentsMutation({
        variables: {
          query: {
            type: SUBSCRIPTION_TYPE.newIncidents,
            userId: { userId: user.id },
          },
          subscription: {
            type: SUBSCRIPTION_TYPE.newIncidents,
            userId: {
              link: user.id,
            },
          },
        },
      });
    } else {
      await deleteSubscriptions({
        variables: { query: { type: SUBSCRIPTION_TYPE.newIncidents, userId: { userId: user.id } } },
      });
    }
    setIsSubscribeToNewIncidents(checked);
  };

  return (
    <div className="mt-4">
      <div className="my-4">
        <ToggleSwitch
          checked={isSubscribeToNewIncidents}
          label={t('Notify me of new Incidents')}
          onChange={onSusbcribeToggle}
          name="subscribe-all"
          disabled={loading || deleting || subscribingToNewIncidents}
        />
      </div>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <Spinner />
          <Trans>Loading...</Trans>
        </div>
      ) : (
        <>
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
                    className={`p-3 ${index < incidentSubscriptions.length - 1 ? 'border-b' : ''}`}
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
                        disabled={deleting && deletingId === subscription.id}
                        onClick={() => handleDeleteSubscription(subscription.id)}
                        data-cy="incident-delete-btn"
                      >
                        {deleting && deletingId === subscription.id ? (
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
            <Trans ns="account">You don&apos;t have active subscriptions to Incident updates</Trans>
          )}

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
                          disabled={deleting && deletingId === subscription.id}
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          data-cy="entity-delete-btn"
                        >
                          {deleting && deletingId === subscription.id ? (
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
            <div className="mt-4">
              <Trans ns="account">You don&apos;t have active subscriptions to Entities</Trans>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserSubscriptions;
