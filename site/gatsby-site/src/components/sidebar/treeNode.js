import React from 'react';
import OpenedSvg from '../images/opened';
import ClosedSvg from '../images/closed';
import config from '../../../config';
import Link from '../ui/Link';

const TreeNode = ({ className = '', setCollapsed, navSetting, item }) => {
  const calculatedClassName = `${className} item ${item.current ? 'active' : 'inactive'}`;

  const hasChildren = item.items.length > 0;

  const click = () => {
    setCollapsed(item['url']);
  };

  return (
    <li className={calculatedClassName}>
      {item.title && (
        <Link to={item.url} onClick={click}>
          {item.title}
          {!config.sidebar.frontLine && item.title && hasChildren ? (
            <button onClick={click} aria-label="collapse" className="collapser">
              {!item.collapsed ? <OpenedSvg /> : <ClosedSvg />}
            </button>
          ) : null}
        </Link>
      )}

      {!item.collapsed && hasChildren ? (
        <ul>
          {item.items.map((item, index) => (
            <TreeNode
              className="subtree"
              key={item.url + index.toString()}
              setCollapsed={setCollapsed}
              navSetting={navSetting}
              item={item}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default TreeNode;
