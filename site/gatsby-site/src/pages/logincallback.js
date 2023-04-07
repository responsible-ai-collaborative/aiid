import React, { useEffect } from 'react';
import * as Realm from 'realm-web';
import { useMenuContext } from 'contexts/MenuContext';

const LoginCallback = (props) => {
  if (props.location.hash.includes('client_app_id=')) {
    Realm.handleAuthRedirect();
  }

  const { isCollapsed, collapseMenu } = useMenuContext();

  useEffect(() => {
    if (isCollapsed) {
      collapseMenu(false);
    }
  }, []);

  return <>Logging in...</>;
};

export default LoginCallback;
