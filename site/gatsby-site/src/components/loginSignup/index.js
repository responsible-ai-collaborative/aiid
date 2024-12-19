import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { useUserContext } from 'contexts/UserContext';

const LoginSignup = ({ className = '', location = null }) => {
  const { user, loading } = useUserContext();

  if (loading) return <span></span>;

  return (
    <>
      <div className={`flex items-center ${className || ''}`}>
        {user ? <Subscriptions /> : <Subscribe location={location} />}
      </div>
    </>
  );
};

const Subscribe = ({ location = null }) => {
  const [redirectUrl, setRedirectUrl] = useState('/');

  const localizePath = useLocalizePath();

  useEffect(() => {
    setRedirectUrl(location?.pathname + location?.hash + location?.search);
  }, [location]);

  return (
    <>
      <Button
        color={'gray'}
        href={localizePath({ path: `/signup/?redirectTo=${redirectUrl}` })}
        size={'sm'}
        data-cy="subscribe-btn"
      >
        <Trans ns="login">Sign Up</Trans>
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
        href={localizePath({ path: '/account/' })}
        size={'sm'}
        data-cy="account-btn"
        className="hover:no-underline"
      >
        <Trans ns="login">Your Account</Trans>
      </Button>
    </div>
  );
};

export default LoginSignup;
