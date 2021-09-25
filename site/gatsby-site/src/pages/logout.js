import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { Spinner } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import { navigate } from 'gatsby';

const Logout = (props) => {
  const {
    actions: { logout },
  } = useUserContext();

  useEffect(() => {
    const init = async () => {
      await logout();
      navigate('/');
    };

    init();
  }, []);

  return (
    <Layout {...props}>
      <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> Logging you out...
    </Layout>
  );
};

export default Logout;
