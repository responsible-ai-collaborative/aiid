import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Spinner } from 'flowbite-react';

const { useTranslation, Trans } = require('react-i18next');

function NotifyButton({ subscribing, onClick, subscribed, userLoggedIn }) {
  const { t } = useTranslation();

  return (
    <Button color="gray" onClick={onClick} data-cy="notify-button">
      <div className="flex gap-2 items-center">
        {userLoggedIn && (subscribing || subscribed == undefined) ? (
          <div data-cy="spinner">
            <Spinner size="sm" />
          </div>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faEnvelope}
              title={t('Notify Me of Updates')}
              titleId="notify-me-of-updated-icon"
            />
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
