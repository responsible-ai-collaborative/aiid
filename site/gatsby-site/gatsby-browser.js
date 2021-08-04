export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    `This website has been updated. Reload to display the latest version?`
  );

  if (answer === true) {
    window.location.reload();
  }
};

import 'bootstrap/dist/css/bootstrap.css';

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { pathname, hash } = location;

  if (pathname !== '/apps/discover' && !pathname.includes('/cite/')) {
    window.scrollTo(0, 0);
  }

  if (pathname.includes('/cite/') && hash === '') {
    window.scrollTo(0, 0);
  }

  return false;
};

import { ToastContextProvider } from './src/contexts/ToastContext';

export const wrapRootElement = ({ element }) => {
  return <ToastContextProvider>{element}</ToastContextProvider>;
};

import './src/global.css';
