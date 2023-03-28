import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { Trans, useTranslation } from 'react-i18next';
import { useUserContext } from '../contexts/userContext';
import { StringParam, useQueryParams } from 'use-query-params';
import Link from '../components/ui/Link';
import { Spinner } from 'flowbite-react';
import useToastContext, { SEVERITY } from 'hooks/useToast';

const ConfirmEmail = (props) => {
  const {
    actions: { confirmEmail },
  } = useUserContext();

  const { t } = useTranslation();

  const addToast = useToastContext();

  const [{ token, tokenId }] = useQueryParams({
    token: StringParam,
    tokenId: StringParam,
  });

  useEffect(() => {
    if (token && tokenId) {
      confirmEmail({ token, tokenId })
        .then(() => {
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
          if ('Rollbar' in window) {
            Rollbar.error(e);
          }
        });
    } else {
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
    <Layout {...props}>
      <div className="flex gap-2">
        <Spinner size="md" />
        <Trans>Loading...</Trans>
      </div>
    </Layout>
  );
};

export default ConfirmEmail;
