import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import HeadContent from 'components/HeadContent';
import { StringParam, useQueryParam } from 'use-query-params';

const AuthError = () => {
  const [errorCode] = useQueryParam('error', StringParam);

  if (!errorCode) {
    return null;
  }

  return (
    <>
      <h1>
        <Trans ns="auth">There was an error with your request</Trans>
      </h1>
      <p>
        <Trans ns="auth" i18nKey={errorCode} />
      </p>
    </>
  );
};

export const Head = (props) => {
  const { t } = useTranslation();

  return (
    <HeadContent
      metaTitle={t('AIID - Auth Error')}
      path={props.location.pathname}
      metaDescription={t('Authentication error')}
    />
  );
};

export default AuthError;
