import { useUserContext } from 'contexts/userContext';
import { Button } from 'flowbite-react';
import React from 'react';
import { Trans } from 'react-i18next';

const LoginSignup = ({ className = '' }) => {
  const { user, loading } = useUserContext();

  if (loading) return <span></span>;

  return (
    <>
      <div className={`flex items-center ${className}`}>
        {user && user.isLoggedIn && user.profile.email ? <Subscriptions /> : <Subscribe />}
      </div>
    </>
  );
};

const Subscribe = () => {
  return (
    <>
      <Button color={'gray'} href="/signup" size={'sm'} data-cy="subscribe-btn">
        <Trans ns="login">Subscribe</Trans>
      </Button>
    </>
  );
};

const Subscriptions = () => {
  return (
    <div className="flex flex-col text-xs w-full justify-center items-center">
      <Button color={'gray'} href="/account" size={'sm'} data-cy="account-btn">
        <Trans ns="login">Your Account</Trans>
      </Button>
    </div>
  );
};

export default LoginSignup;
