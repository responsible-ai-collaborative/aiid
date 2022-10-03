import { ListGroup, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import { DELETE_SUBSCRIPTIONS, FIND_USER_SUBSCRIPTIONS } from '../graphql/subscriptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import Link from 'components/ui/Link';

const UserSubscriptions = () => {
  const { user } = useUserContext();

  const { t } = useTranslation(['account']);

  const [subscriptions, setSubscriptions] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const { data, loading } = useQuery(FIND_USER_SUBSCRIPTIONS, {
    variables: { query: { userId: { userId: user.id } } },
  });

  const [deleteSubscriptions, { loading: deleting }] = useMutation(DELETE_SUBSCRIPTIONS);

  const handleDeleteSubscription = async (subscriptionId) => {
    if (confirm(t('Do you want to delete this subscription?'))) {
      setDeletingId(subscriptionId);

      await deleteSubscriptions({ variables: { query: { _id: subscriptionId } } });

      const newList = subscriptions.filter((subscription) => subscription._id !== subscriptionId);

      setSubscriptions(newList);

      setDeletingId(null);
    }
  };

  useEffect(() => {
    setSubscriptions(data?.subscriptions);
  }, [user, data]);

  return (
    <div className="mt-4">
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <Spinner />
          <Trans>Loading...</Trans>
        </div>
      ) : subscriptions?.length > 0 ? (
        <ListGroup>
          {subscriptions
            .map((subscription) => ({
              id: subscription._id,
              type: subscription.type,
              incidentId: subscription.incident_id.incident_id,
              incidentTitle: subscription.incident_id.title,
            }))
            .sort((a, b) => a.incidentId - b.incidentId) // sort subscriptions by Incident ID ascendant
            .map((subscription, index) => (
              <div
                className={`p-3 ${index < subscriptions.length - 1 ? 'border-b' : ''}`}
                key={`subscription-${subscription.id}`}
                data-cy="subscription-item"
              >
                <div className="flex flex-row w-full justify-between gap-3 items-center">
                  <div className="items-center">
                    {subscription.type === 'incident' && (
                      <>
                        <Trans ns="account">Updates on incident </Trans>
                        <Link to={`/cite/${subscription.incidentId}`}>
                          #{subscription.incidentId}: {subscription.incidentTitle}
                        </Link>
                      </>
                    )}
                  </div>
                  <Button
                    size={'xs'}
                    color={'failure'}
                    disabled={deleting && deletingId === subscription.id}
                    onClick={() => handleDeleteSubscription(subscription.id)}
                    data-cy="delete-btn"
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
        <Trans ns="account">You don&apos;t have active subscriptions</Trans>
      )}
    </div>
  );
};

export default UserSubscriptions;
