import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from '@reach/router';
import TreeNode from './treeNode';

const Tree = ({
  items,
  isCollapsed,
  setNavCollapsed,
  localizePath,
  additionalNodes = [],
  expandedNodes,
  toggleExpand,
  isMobile,
}) => {
  const location = useLocation();

  const [currentLocation, setCurrentLocation] = React.useState('');

  React.useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  const subtreeNav = (subItems) => {
    return subItems.map((item) => {
      const localizedPath = localizePath({ path: item.url || item.path });

      const currentVisit =
        currentLocation &&
        [localizedPath, `${localizedPath}/`].includes(localizePath({ path: currentLocation }));

      // Recursively process child items
      const children = item.items?.length > 0 ? subtreeNav(item.items) : [];

      // Check if any child has a "currentVisit" status to determine "childVisit"
      const childVisit = children.some((child) => child.current || child.childVisit);

      return {
        ...item,
        items: children,
        current: currentVisit,
        collapsed: !currentVisit && !childVisit,
        childVisit,
      };
    });
  };

  const processedItems = subtreeNav([...items, ...additionalNodes]);

  return (
    <>
      {processedItems.map((item) => (
        <TreeNode
          key={item.url || item.path || item.title}
          item={item}
          isCollapsed={isCollapsed}
          setNavCollapsed={setNavCollapsed}
          isExpanded={expandedNodes[item.url || item.path || item.title] || false} // Check if the node is expanded
          toggleExpand={toggleExpand} // Pass down the toggle function
          expandedNodes={expandedNodes}
          isMobile={isMobile}
        />
      ))}
    </>
  );
};

Tree.propTypes = {
  items: PropTypes.array.isRequired,
  isCollapsed: PropTypes.bool,
  setNavCollapsed: PropTypes.func,
  localizePath: PropTypes.func,
  additionalNodes: PropTypes.array,
  expandedNodes: PropTypes.object.isRequired,
  toggleExpand: PropTypes.func.isRequired,
};

export default Tree;
