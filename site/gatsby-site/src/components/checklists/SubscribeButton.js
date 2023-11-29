import React from 'react';
import { Button } from 'flowbite-react';
import { UPSERT_SUBSCRIPTION } from '../../graphql/subscriptions';
import { useMutation } from '@apollo/client';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';

const SubscribeButton = ({ checklistId }) => {
  const { t } = useTranslation();

  const { user } = useUserContext();

  const [insertSubscription] = useMutation(UPSERT_SUBSCRIPTION);

  const addToast = useToastContext();

  const subscription = {
    type: 'checklist',
    userId: { link: user.id },
    checklistId: { link: checklistId },
  };

  const subscribe = async () => {
    try {
      await insertSubscription({
        variables: {
          subscription,
        },
      });
    } catch (error) {
      addToast({
        message: t('Could not subscribe to checklist'),
        severity: SEVERITY.danger,
        error,
      });
      return;
    }
    addToast({
      message: t('Added checklist to your subscriptions'),
      severity: SEVERITY.success,
    });
  };

  return (
    <div data-cy="subscribe-button">
      <Button color="light" onClick={subscribe}>
        <Trans>Subscribe</Trans>
      </Button>
    </div>
  );
};

export default SubscribeButton;
