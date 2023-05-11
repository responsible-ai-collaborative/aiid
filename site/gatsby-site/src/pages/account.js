import React from 'react';
import { Spinner } from 'flowbite-react';
import { useUserContext } from '../contexts/userContext';
import { Trans, useTranslation } from 'react-i18next';
import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import AiidHelmet from 'components/AiidHelmet';
import UserSubscriptions from 'components/UserSubscriptions';
import UserDetails from 'components/users/UserDetails';

const Account = (props) => {
  const { user, loading } = useUserContext();

  const { t } = useTranslation(['account']);

  return (
    <Layout {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>{t('Account Details')}</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <h1 className="font-karla font-bold flex-1 pt-0">
          <Trans ns="account">Account Details</Trans>
        </h1>
      </div>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <Spinner />
          <Trans>Loading...</Trans>
        </div>
      ) : user && user.isLoggedIn && user.profile.email ? (
        <>
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
        </>
      ) : (
        <Link to="/login">
          <Trans ns="login">Login</Trans>
        </Link>
      )}
    </Layout>
  );
};

export default Account;
