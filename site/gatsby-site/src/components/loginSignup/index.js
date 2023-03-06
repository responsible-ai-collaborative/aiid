import { useUserContext } from 'contexts/userContext';
import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import useLocalizePath from 'components/i18n/useLocalizePath';

const LoginSignup = ({ className = '' }) => {
  const { user, loading } = useUserContext();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    setIsUserLoggedIn(!!user?.profile.email);
  }, [user]);

  if (loading) return <span></span>;

  return (
    <>
      <div className={`flex items-center ${className}`}>
        {isUserLoggedIn ? <Subscriptions /> : <Subscribe />}
      </div>
    </>
  );
};

const Subscribe = () => {
  const localizePath = useLocalizePath();

  return (
    <>
      <Button
        color={'gray'}
        href={localizePath({ path: '/signup' })}
        size={'sm'}
        data-cy="subscribe-btn"
      >
        <Trans ns="login">Subscribe</Trans>
      </Button>
    </>
  );
};

const Subscriptions = () => {
  const localizePath = useLocalizePath();

  return (
    <div className="flex flex-col text-xs w-full justify-center items-center">
      <Button
        color={'gray'}
        href={localizePath({ path: '/account' })}
        size={'sm'}
        data-cy="account-btn"
      >
        <Trans ns="login">Your Account</Trans>
      </Button>
    </div>
  );
};

export default LoginSignup;
