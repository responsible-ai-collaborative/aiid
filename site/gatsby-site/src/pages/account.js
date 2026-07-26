import React from 'react';
import { Spinner } from 'flowbite-react';
import { useUserContext } from 'contexts/UserContext';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import UserSubscriptions from 'components/UserSubscriptions';
import UserDetails from 'components/users/UserDetails';
import HeadContent from 'components/HeadContent';
import { ApiAccessGate } from 'components/ui/ApiLoginRequired';

const Account = () => {
  const { user, loading } = useUserContext();

  return (
    <>
      <div className={'titleWrapper'}>
        <h1>
          <Trans ns="account">Account Details</Trans>
        </h1>
      </div>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <Spinner />
          <Trans>Loading...</Trans>
        </div>
      ) : user && !loading ? (
        // Both panels below read through the API. A logged-out visitor is caught by
        // the `user` check, but a *blocked* account has a valid session and would
        // otherwise reach them, so the gate wraps them as well.
        // SEE: server/apiAccess.ts
        <ApiAccessGate>
          <div className="block p-6 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <h2>
              <Trans ns="account">About You</Trans>
            </h2>
            <UserDetails userId={user.id} />
          </div>

          <div className="block mt-6 p-6 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <h2>
              <Trans ns="account">Subscriptions</Trans>
            </h2>
            <UserSubscriptions />
          </div>
        </ApiAccessGate>
      ) : (
        <Link to="/login">
          <Trans ns="login">Login</Trans>
        </Link>
      )}
    </>
  );
};

export const Head = (props) => {
  const { t } = useTranslation(['account']);

  return (
    <HeadContent
      path={props.location.pathname}
      metaTitle={t('Account Details')}
      metaDescription={t('Account Deails')}
    />
  );
};

export default Account;
