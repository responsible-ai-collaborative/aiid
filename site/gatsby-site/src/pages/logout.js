import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { Spinner } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import { navigate } from 'gatsby';
import { Trans } from 'react-i18next';
import useLocalizePath from 'components/i18n/useLocalizePath';

const Logout = (props) => {
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
    <Layout {...props} className="bootstrap">
      <Spinner animation="border" size="sm" role="status" aria-hidden="true" />{' '}
      <Trans ns="login">Logging you out...</Trans>
    </Layout>
  );
};

export default Logout;
