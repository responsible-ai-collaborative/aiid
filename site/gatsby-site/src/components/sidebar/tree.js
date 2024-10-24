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
}) => {
  const location = useLocation(); // Listen for location changes

  const [currentLocation, setCurrentLocation] = React.useState('');

  React.useEffect(() => {
    setCurrentLocation(location.pathname); // Update the current location on path change
  }, [location]);

  const subtreeNav = (subItems) => {
    return subItems.map((item) => {
      const localizedPath = localizePath({ path: item.url || item.path });

      const currentVisit =
        currentLocation &&
        [localizedPath, `${localizedPath}/`].includes(localizePath({ path: currentLocation }));

      let childVisit = false;

      const children = item.items?.length > 0 ? subtreeNav(item.items) : [];

      children.forEach((childItem) => {
        if (
          !childVisit &&
          [
            localizePath({ path: childItem.url }),
            `${localizePath({ path: childItem.url })}/`,
          ].includes(currentLocation)
        ) {
          childVisit = true;
        }
      });

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
    <ul className="tree flex flex-col space-y-2">
      {processedItems.map((item) => (
        <TreeNode
          key={item.url || item.path || item.title}
          item={item}
          isCollapsed={isCollapsed}
          setNavCollapsed={setNavCollapsed}
          isExpanded={expandedNodes[item.url || item.path || item.title] || false} // Check if the node is expanded
          toggleExpand={toggleExpand} // Pass down the toggle function
          expandedNodes={expandedNodes}
        />
      ))}
    </ul>
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
