import React, { useEffect } from 'react';
import { Spinner } from 'flowbite-react';
import { useUserContext } from '../contexts/userContext';
import { navigate } from 'gatsby';
import { Trans } from 'react-i18next';
import useLocalizePath from '../components/i18n/useLocalizePath';

const Logout = () => {
  const {
    actions: { logout },
  } = useUserContext();

  const localizePath = useLocalizePath();

  useEffect(() => {
    const init = async () => {
      await logout();
      navigate(localizePath({ path: `/` }));
    };

    init();
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <Spinner />
      <Trans ns="login">Logging you out...</Trans>
    </div>
  );
};

export default Logout;
