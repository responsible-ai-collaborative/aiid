import React, { useEffect, useState } from 'react';
import config from '../../../config';
import TreeNode from './treeNode';
import { useLocation } from '@reach/router';

const subtreeNav = (treeRoot, currentLocation = undefined, localizePath) => {
  let subs = [];

  treeRoot.forEach((item) => {
    const defaultNavSetting = {
      url: item.url,
      label: item.label,
      title: item.title,
      items: subtreeNav(item.items, currentLocation, localizePath),
      collapsed: false,
      childVisit: false,
      current: false,
    };

    let currentVisit, childVisit;

    if (typeof currentLocation == 'undefined' && typeof document != 'undefined') {
      currentLocation = document.location.pathname;
    }

    currentVisit =
      currentLocation &&
      [
        localizePath({ path: item.url }),
        localizePath({ path: config.gatsby.pathPrefix + item.url === '/' ? '' : item.url }),
      ].includes(localizePath({ path: currentLocation }));

    childVisit = false;
    defaultNavSetting.items.forEach((item) => {
      if (
        !childVisit &&
        currentLocation &&
        (localizePath({ path: currentLocation }) === localizePath({ path: item.url }) ||
          localizePath({ path: currentLocation }) ===
            localizePath({ path: config.gatsby.pathPrefix + item.url }))
      ) {
        childVisit = true;
      }
    });

    defaultNavSetting.collapsed = !currentVisit && !childVisit;
    defaultNavSetting.childVisit = childVisit;
    defaultNavSetting.current = currentVisit;

    subs.push(defaultNavSetting);
  });
  return subs;
};

const Tree = ({
  setNavCollapsed = null,
  localizePath,
  isCollapsed = false,
  additionalNodes = [],
  items = [],
}) => {
  const location = useLocation();

  const [navSettings, setNavSetting] = useState(
    subtreeNav([...items, ...additionalNodes], location.pathname, localizePath)
  );

  useEffect(() => {
    const nodes = subtreeNav([...items, ...additionalNodes], location.pathname, localizePath);

    setNavSetting(nodes);
  }, [items, additionalNodes]);

  const toggle = (url) => {
    setNavSetting(subtreeNav(navSettings, url, localizePath));
    setNavCollapsed && setNavCollapsed(true);
  };

  return (
    <>
      {navSettings.map((cur, index) => {
        return (
          <TreeNode
            key={cur.url + index.toString()}
            setCollapsed={toggle}
            navSetting={navSettings}
            item={cur}
            isCollapsed={isCollapsed}
          />
        );
      })}
    </>
  );
};

export default Tree;
