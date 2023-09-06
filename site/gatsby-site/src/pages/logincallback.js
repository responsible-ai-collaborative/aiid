import React from 'react';
import * as Realm from 'realm-web';

const LoginCallback = (props) => {
  if (props.location.hash.includes('client_app_id=')) {
    Realm.handleAuthRedirect();
  }

  return <>Logging in...</>;
};

export default LoginCallback;
