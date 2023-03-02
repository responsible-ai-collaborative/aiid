import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../elements/Button';
import { Spinner } from 'flowbite-react';
import Link from '../components/ui/Link';
import { useMutation } from '@apollo/client';
import { DELETE_SUBSCRIPTIONS } from '../graphql/subscriptions';
import { NumberParam, StringParam, useQueryParams } from 'use-query-params';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';

const Unsubscribe = (props) => {
  const [pageMessage, setPageMessage] = useState(null);

  const [unsubscribing, setUnsubscribing] = useState(false);

  let errorMessage = null;

  const { t } = useTranslation();

  const [DeleteSubscriptions] = useMutation(DELETE_SUBSCRIPTIONS);

  const [{ type: subscriptionType, incidentId, userId }] = useQueryParams({
    type: StringParam,
    incidentId: NumberParam,
    userId: StringParam,
  });

  // this is to get through hydration errors but the page should be refactored
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (
    !subscriptionType ||
    !userId ||
    (subscriptionType == SUBSCRIPTION_TYPE.incident && !incidentId) ||
    (subscriptionType !== SUBSCRIPTION_TYPE.all &&
      subscriptionType !== SUBSCRIPTION_TYPE.newIncidents &&
      subscriptionType !== SUBSCRIPTION_TYPE.incident)
  ) {
    errorMessage = t('Invalid parameters');
  }

  const unsubscribe = async () => {
    try {
      setUnsubscribing(true);

      const query = {
        userId: { userId },
      };

      if (subscriptionType === SUBSCRIPTION_TYPE.incident) {
        query.type = subscriptionType;
        query.incident_id = { incident_id: `${incidentId}` };
      } else if (subscriptionType === SUBSCRIPTION_TYPE.newIncidents) {
        query.type = subscriptionType;
      }

      await DeleteSubscriptions({ variables: { query } });

      setPageMessage(t('You have successfully unsubscribed.'));
    } catch (e) {
      setPageMessage(t('An unknown error has ocurred'));
      // eslint-disable-next-line no-undef
      Rollbar.error(e);
    } finally {
      setUnsubscribing(false);
    }
  };

  return (
    <Layout {...props}>
      {mounted && (
        <>
          {errorMessage || pageMessage ? (
            <>
              <p>
                {errorMessage}
                {pageMessage}
              </p>
              <Link to={'/'}>
                <Trans>Continue</Trans>
              </Link>
            </>
          ) : (
            <>
              <p>
                {subscriptionType === SUBSCRIPTION_TYPE.incident && (
                  <Trans>
                    Do you want to unsubscribe from{' '}
                    <Link to={`/cite/${incidentId}`}>incident {{ incidentId }}</Link> updates?
                  </Trans>
                )}
                {subscriptionType === SUBSCRIPTION_TYPE.all && (
                  <Trans>Do you want to unsubscribe from all notifications?</Trans>
                )}
              </p>
              <Button variant="primary" onClick={unsubscribe}>
                <div className="flex gap-2">
                  {unsubscribing && <Spinner size="sm" />}
                  <Trans>Confirm</Trans>
                </div>
              </Button>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default Unsubscribe;
