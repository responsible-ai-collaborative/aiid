import React, { useState } from 'react';
import config from '../../../config';
import TreeNode from './treeNode';

const navConfig = config.sidebar.navConfig;

const subtreeNav = (treeRoot, currentLocation = undefined) => {
  let subs = [];

  treeRoot.forEach((item) => {
    const defaultNavSetting = {
      url: item.url,
      label: item.label,
      icon: item.icon,
      title: item.title,
      items: subtreeNav(item.items, currentLocation),
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
      (currentLocation === item.url || currentLocation === config.gatsby.pathPrefix + item.url);

    childVisit = false;
    defaultNavSetting.items.forEach((item) => {
      if (
        !childVisit &&
        currentLocation &&
        (currentLocation === item.url || currentLocation === config.gatsby.pathPrefix + item.url)
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

const Tree = ({ setNavCollapsed }) => {
  const defaultNavSettings = subtreeNav(navConfig);

  const [navSettings, setNavSetting] = useState(defaultNavSettings);

  const toggle = (url) => {
    setNavSetting(subtreeNav(navConfig, url));
    setNavCollapsed && setNavCollapsed(true);
  };

  return navSettings.map((cur, index) => {
    return (
      <TreeNode
        key={cur.url + index.toString()}
        setCollapsed={toggle}
        navSettings={navSettings}
        item={cur}
      />
    );
  });
};

export default Tree;
