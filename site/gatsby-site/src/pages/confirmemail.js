import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useUserContext } from '../contexts/userContext';
import { StringParam, useQueryParams } from 'use-query-params';
import Link from '../components/ui/Link';
import { Spinner } from 'flowbite-react';
import useToastContext, { SEVERITY } from 'hooks/useToast';

const ConfirmEmail = () => {
  const {
    actions: { confirmEmail },
  } = useUserContext();

  const { t } = useTranslation();

  const addToast = useToastContext();

  const [confirmed, setConfirmed] = useState(null);

  const [{ token, tokenId }] = useQueryParams({
    token: StringParam,
    tokenId: StringParam,
  });

  useEffect(() => {
    if (token && tokenId) {
      confirmEmail({ token, tokenId })
        .then(() => {
          setConfirmed(true);
          addToast({
            message: (
              <>
                <label>{t('Thank you for verifying your account.')}</label>{' '}
                <Link to={'/login?redirectTo=/account/'} data-cy="confirm-login-btn">
                  <Trans>Login</Trans>
                </Link>
              </>
            ),
            severity: SEVERITY.success,
          });
        })
        .catch((e) => {
          setConfirmed(false);
          addToast({
            message: (
              <>
                <label className="capitalize">{t('An unknown error has ocurred')}</label>{' '}
                <Link to={'/login?redirectTo=/account/'} data-cy="confirm-login-btn">
                  <Trans>Login</Trans>
                </Link>
              </>
            ),
            severity: SEVERITY.danger,
            error: e,
          });
        });
    } else {
      setConfirmed(false);
      addToast({
        message: (
          <>
            <label className="capitalize">{t('Invalid parameters')}</label>
            <Link to={'/login?redirectTo=/account/'} data-cy="confirm-login-btn">
              <Trans>Login</Trans>
            </Link>
          </>
        ),
        severity: SEVERITY.danger,
      });
    }
  }, []);

  return (
    <>
      {confirmed ? (
        <p>
          <Trans>Thank you for verifying your account.</Trans>
        </p>
      ) : confirmed === false ? (
        <p>
          <Trans>An unknown error has ocurred</Trans>
        </p>
      ) : (
        <div className="flex gap-2">
          <Spinner size="md" />
          <Trans>Loading...</Trans>
        </div>
      )}
    </>
  );
};

export default ConfirmEmail;
