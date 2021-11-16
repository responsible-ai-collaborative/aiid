export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This website has been updated. Reload to display the latest version?`
  );

  if (answer === true) {
    window.location.reload();
  }
};

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

import '@fortawesome/fontawesome-svg-core/styles.css';

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { pathname, hash } = location;

  if (pathname.includes('/cite/') && hash !== '') {
    return hash.split('#')[1];
  }

  if (pathname.includes('/apps/discover')) {
    return false;
  }

  return true;
};

import { ToastContextProvider } from './src/contexts/ToastContext';

export const wrapRootElement = ({ element }) => {
  return <ToastContextProvider>{element}</ToastContextProvider>;
};

import './src/global.css';
