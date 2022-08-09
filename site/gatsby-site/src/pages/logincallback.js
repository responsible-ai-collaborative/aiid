import React from 'react';
import Layout from '../components/Layout';
import * as Realm from 'realm-web';

const LoginCallback = (props) => {
  Realm.handleAuthRedirect();

  return <Layout {...props}>Logging in...</Layout>;
};

export default LoginCallback;
