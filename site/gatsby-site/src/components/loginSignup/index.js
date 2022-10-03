import { useUserContext } from 'contexts/userContext';
import { Button, Spinner } from 'flowbite-react';
import React from 'react';
import { Trans } from 'react-i18next';
import Link from 'components/ui/Link';
import useLocalizePath from '../../components/i18n/useLocalizePath';
import { useLocalization } from 'gatsby-theme-i18n';

const LoginSignup = ({ className = '', logoutClassName = '', loginClassName = '' }) => {
  const { user, loading } = useUserContext();

  if (loading)
    return (
      <span className="hidden md:flex">
        <Spinner />
      </span>
    );

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

const Login = ({ className = '' }) => {
  const localizePath = useLocalizePath();

  const { locale } = useLocalization();

  return (
    <>
      <Link
        to={localizePath({ path: '/login', language: locale })}
        className={`${className}`}
        data-cy="login-link"
      >
        <Trans ns="login">Login</Trans>
      </Link>
      <span className="mx-2 text-gray-300">
        <Trans>or</Trans>
      </span>
      <Button color={'gray'} href="/signup" size={'sm'} data-cy="signup-link">
        <Trans ns="login">Sign up</Trans>
      </Button>
    </>
  );
};

const Logout = ({ className = '', user }) => {
  const localizePath = useLocalizePath();

  const { locale } = useLocalization();

  return (
    <div className="flex flex-col text-xs w-full justify-center items-center">
      <Link
        to={localizePath({ path: '/account', language: locale })}
        className={`${className}`}
        data-cy="account-link"
      >
        <Trans ns="login">{user?.profile?.email}</Trans>
      </Link>
    </div>
  );
};

export default LoginSignup;
