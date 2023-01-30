import React from 'react';
import { Spinner } from 'flowbite-react';
import { useUserContext } from '../contexts/userContext';
import { Trans, useTranslation } from 'react-i18next';
import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import AiidHelmet from 'components/AiidHelmet';
import { StyledHeading } from 'components/styles/Docs';
import UserSubscriptions from 'components/UserSubscriptions';

const Account = (props) => {
  const { user, loading } = useUserContext();

  const { t } = useTranslation(['account']);

  return (
    <Layout {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>{t('Account Details')}</title>
      </AiidHelmet>
      <div className={'titleWrapper'}>
        <StyledHeading>
          <Trans ns="account">Account Details</Trans>
        </StyledHeading>
      </div>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <Spinner />
          <Trans>Loading...</Trans>
        </div>
      ) : user && user.isLoggedIn && user.profile.email ? (
        <>
          <div className="block p-6 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <p>
              <Trans>Email address</Trans>
              {': '}
              {user.profile.email}
            </p>
            <Link to="/logout">
              <Trans ns="login">Log out</Trans>
            </Link>
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
