import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Trans, useTranslation } from 'react-i18next';
import { useUserContext } from '../contexts/userContext';
import { StringParam, useQueryParams } from 'use-query-params';
import Link from '../components/ui/Link';
import { Spinner } from 'flowbite-react';

const ConfirmEmail = (props) => {
  const {
    actions: { confirmEmail },
  } = useUserContext();

  const [pageMessage, setPageMessage] = useState(null);

  const { t } = useTranslation();

  const [{ token, tokenId }] = useQueryParams({
    token: StringParam,
    tokenId: StringParam,
  });

  useEffect(() => {
    if (token && tokenId) {
      confirmEmail({ token, tokenId })
        .then(() => {
          setPageMessage(t('Thank you for verifying your account.'));
        })
        .catch((e) => {
          setPageMessage(t('An unknown error has ocurred'));
          // eslint-disable-next-line no-undef
          Rollbar.error(e);
        });
    } else {
      setPageMessage(t('Invalid parameters'));
    }
  }, []);

  return (
    <Layout {...props}>
      {pageMessage ? (
        <>
          <p>{pageMessage}</p>
          <Link to={'/login?redirectTo=/account'} data-cy="confirm-login-btn">
            <Trans>Login</Trans>
          </Link>
        </>
      ) : (
        <div className="flex gap-2">
          <Spinner size="md" />
          <Trans>Loading...</Trans>
        </div>
      )}
    </Layout>
  );
};

export default ConfirmEmail;
