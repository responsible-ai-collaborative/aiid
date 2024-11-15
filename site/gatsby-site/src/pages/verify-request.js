import React from 'react';
import { useUserContext } from 'contexts/UserContext';
import { Trans, useTranslation } from 'react-i18next';
import { StringParam, useQueryParams } from 'use-query-params';
import HeadContent from 'components/HeadContent';
import { Spinner } from 'flowbite-react';

const VerifyRequest = () => {
  const { user, loading } = useUserContext();

  const [{ email }] = useQueryParams({ email: StringParam });

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (user) {
    return (
      <div>
        <Trans ns="login">Logged in as:</Trans> {user.email}
      </div>
    );
  }

  return (
    <>
      <h1>
        <Trans>Check your email</Trans>
      </h1>
      <p>
        <Trans>A sign in link has been sent to {email}</Trans>
      </p>
    </>
  );
};

export const Head = (props) => {
  const { t } = useTranslation();

  return (
    <HeadContent
      metaTitle={t('AIID - Verify Request')}
      path={props.location.pathname}
      metaDescription={t('Check your email for a sign in link')}
    />
  );
};

export default VerifyRequest;
