import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
const { Button, Spinner } = require('flowbite-react');

const { useTranslation, Trans } = require('react-i18next');

function NotifyButton({ subscribing, onClick, subscribed }) {
  const { t } = useTranslation();

  return (
    <Button color="gray" onClick={onClick}>
      <div className="flex gap-2 items-center">
        {subscribing ? (
          <div>
            <Spinner size="sm" />
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faEnvelope} title={t('Notify Me of Updates')} />
            {subscribed ? (
              <Trans>Subscribed to Updates</Trans>
            ) : (
              <Trans>Notify Me of Updates</Trans>
            )}
          </>
        )}
      </div>
    </Button>
  );
}

export default NotifyButton;
