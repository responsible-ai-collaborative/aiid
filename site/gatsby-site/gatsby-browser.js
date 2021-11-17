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

export const shouldUpdateScroll = ({ routerProps: { location }, getSavedScrollPosition }) => {
  const { pathname, hash } = location;

  const currentPosition = getSavedScrollPosition(location);

  if (pathname.includes('/cite/') && hash !== '') {
    const id = hash.split('#')[1];

    const item = document.querySelector(`#${CSS.escape(id)}`);

    const top = item.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({ top, behavior: 'smooth' });

    return false;
  }

  if (pathname.includes('/apps/discover')) {
    return false;
  }

  window.scrollTo(currentPosition || [0, 0]);
};

import { ToastContextProvider } from './src/contexts/ToastContext';

export const wrapRootElement = ({ element }) => {
  return <ToastContextProvider>{element}</ToastContextProvider>;
};

import './src/global.css';
