import { useUserContext } from 'contexts/userContext';
import { Button, Tooltip } from 'flowbite-react';
import React from 'react';
import { Trans } from 'react-i18next';

const LoginSignup = ({ className = '', logoutClassName = '', loginClassName = '' }) => {
  const { user } = useUserContext();

  return (
    <>
      <div className={`flex items-center ${className}`}>
        {user && user.isLoggedIn && user.profile.email ? (
          <Logout className={logoutClassName} user={user} />
        ) : (
          <Login className={loginClassName} />
        )}
      </div>
    </>
  );
};

const Login = ({ className = '' }) => (
  <>
    <a href="/login" className={`${className}`}>
      <Trans ns="login">Login</Trans>
    </a>
    <span className="mx-2 text-gray-300">
      <Trans>or</Trans>
    </span>
    <Button color={'gray'} href="/signup" size={'sm'}>
      <Trans ns="login">Sign up</Trans>
    </Button>
  </>
);

const Logout = ({ className = '', user }) => (
  <div className="flex flex-col text-xs w-full justify-center items-center">
    <Tooltip content={`Logged in as ${user.profile.email}`}>
      <a href="/logout" className={`${className}`}>
        <Trans ns="login">Log out</Trans>
      </a>
    </Tooltip>
  </div>
);

export default LoginSignup;
