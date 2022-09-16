import { useUserContext } from 'contexts/userContext';
import { Button } from 'flowbite-react';
import React from 'react';

const LoginSinup = ({ className = '', logoutClassName = '', loginClassName = '' }) => {
  const { user } = useUserContext();

  return (
    <>
      <div className={`flex items-center ${className}`}>
        {user && user.isLoggedIn && user.profile.email ? (
          <Logout className={logoutClassName} />
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
      Login
    </a>
    <span className="mx-2 text-gray-300">or</span>
    <Button color={'gray'} href="/signup" size={'sm'}>
      Sign up
    </Button>
  </>
);

const Logout = ({ className = '' }) => (
  <>
    <a href="/logout" className={`${className}`}>
      Sign out
    </a>
  </>
);

export default LoginSinup;
