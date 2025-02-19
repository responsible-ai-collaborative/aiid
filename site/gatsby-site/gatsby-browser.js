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

/**
 * Scrolls smoothly to the anchor specified in the URL hash.
 * If the page is still loading, it waits until the document is fully loaded.
 * It uses requestAnimationFrame for efficient checking and scrolling.
 *
 * @param {object} location - The location object containing the URL.
 * @param {number} mainNavHeight - The height of the main navigation to offset the scroll position (default is 0).
 */
function scrollToAnchor(location, mainNavHeight = 0) {
  if (location && location.hash) {
    const checkAndScroll = () => {
      if (document.readyState === 'complete') {
        const item = document.querySelector(location.hash);

        if (item) {
          const itemTop = item.offsetTop - mainNavHeight;

          const itemBottom = itemTop + item.offsetHeight;

          const viewportTop = window.scrollY;

          const viewportBottom = viewportTop + window.innerHeight;

          // Check if the item is already in view
          if (itemBottom > viewportTop && itemTop < viewportBottom) {
            return;
          }

          window.scrollTo({
            top: itemTop,
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
