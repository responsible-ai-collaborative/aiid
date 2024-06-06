import './src/tailwind.css';
import './src/global.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './src/custom.css';

export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { pathname } = location;

  if (pathname.includes('/apps/discover')) {
    return false;
  }
};

const onRouteUpdate = ({ location }) => scrollToAnchor(location);

function scrollToAnchor(location, mainNavHeight = 0) {
  if (location && location.hash) {
    const checkAndScroll = () => {
      if (document.readyState === 'complete') {
        const item = document.querySelector(location.hash);

        if (item) {
          const itemTop = item.offsetTop;

          window.scrollTo({
            top: itemTop - mainNavHeight,
            behavior: 'smooth',
          });
        }
      } else {
        requestAnimationFrame(checkAndScroll);
      }
    };

    requestAnimationFrame(checkAndScroll);
  }
  return true;
}

import { wrapRootElement, wrapPageElement } from './gatsby-shared';

export { wrapPageElement, wrapRootElement, onRouteUpdate };
