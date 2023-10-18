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

  const subscribe = async () => {
    try {
      await insertSubscription({
        variables: {
          subscription: {
            type: 'checklist',
            userId: { link: user.id },
            checklistId: { link: checklistId },
          },
        },
      });
    } catch (error) {
      addToast({
        message: t('Could not subscribe to checklist'),
        severity: SEVERITY.danger,
        error,
      });
    }
    addToast({
      message: t('Added checklist to your subscriptions'),
      severity: SEVERITY.success,
    });
  };

  return (
    <Button color="light" onClick={subscribe}>
      <Trans>Subscribe</Trans>
    </Button>
  );
};

export default SubscribeButton;
