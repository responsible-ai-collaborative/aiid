import React from 'react';
import { useUserContext } from 'contexts/UserContext';
import { Trans, useTranslation } from 'react-i18next';
import HeadContent from 'components/HeadContent';
import { Spinner } from 'flowbite-react';

const VerifyRequest = ({ location: { state } }) => {
  const { user, loading } = useUserContext();

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

  if (state?.operation == 'login') {
    return (
      <>
        <h1>
          <Trans>Check your email</Trans>
        </h1>
        <p>
          <Trans>A sign in link has been sent to {state.email}</Trans>
        </p>
      </>
    );
  }

  if (state?.operation == 'signup') {
    return (
      <>
        <h1>
          <Trans>Check your email</Trans>
        </h1>
        <p>
          <Trans>A sign up link has been sent to {state.email}</Trans>
        </p>
      </>
    );
  }

  return null;
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
