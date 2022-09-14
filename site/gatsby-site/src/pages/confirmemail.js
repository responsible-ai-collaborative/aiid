import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Trans, useTranslation } from 'react-i18next';
import { useUserContext } from '../contexts/userContext';
import { StringParam, useQueryParams } from 'use-query-params';
import Link from '../components/ui/Link';
import { Spinner } from 'flowbite-react';

const ConfirmEmail = (props) => {

  const { actions: { confirmEmail }, } = useUserContext();

  let errorMessage = null;

  const [pageMessage, setPageMessage] = useState(null);

  const [isConfirmed, setIsConfirmed] = useState(false);

  const { t } = useTranslation();

  const [{ token, tokenId }] = useQueryParams({
    token: StringParam,
    tokenId: StringParam,
  });

  if (!token || !tokenId) {
    errorMessage = t('Invalid parameters');
  }

  const confirm = async ({ token, tokenId }) => {
    try {
      await confirmEmail({ token, tokenId });

      setIsConfirmed(true);

      setPageMessage(t('Thank you for verifying your account.'));
    } catch (error) {
      setPageMessage(t('An unknown error has ocurred'));
    }
  };

  if (!isConfirmed) {
    confirm({ token, tokenId });
  }

  return <Layout {...props}>
    {
      errorMessage || pageMessage ? (
        <>
          <p>
            {errorMessage}
            {pageMessage}
          </p>
          <Link to={'/login'}>
            <Trans>Login</Trans>
          </Link>
        </>
      ) : (
        <div className="flex gap-2">
          <Spinner size="md" />
          <Trans>Loading...</Trans>
        </div>
      )
    }
  </Layout>;
};

export default ConfirmEmail;
