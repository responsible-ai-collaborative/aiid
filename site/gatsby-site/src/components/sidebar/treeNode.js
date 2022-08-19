import React from 'react';
import OpenedSvg from '../images/opened';
import ClosedSvg from '../images/closed';
import config from '../../../config';
import Link from '../ui/Link';
import { Trans } from 'react-i18next';
import {
  faDoorOpen,
  faSearch,
  faPlusCircle,
  faMedal,
  faSortAlphaDown,
  faNewspaper,
  faChartPie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getIcon = (label) =>
  ({
    welcome: <FontAwesomeIcon icon={faDoorOpen} className="pointer fa tw-mr-1" fixedWidth />,
    discover: <FontAwesomeIcon icon={faSearch} className="pointer fa tw-mr-1" fixedWidth />,
    submit: <FontAwesomeIcon icon={faPlusCircle} className="pointer fa tw-mr-1" fixedWidth />,
    leaderboard: <FontAwesomeIcon icon={faMedal} className="pointer fa tw-mr-1" fixedWidth />,
    wordcounts: (
      <FontAwesomeIcon icon={faSortAlphaDown} className="pointer fa tw-mr-1" fixedWidth />
    ),
    blog: <FontAwesomeIcon icon={faNewspaper} className="pointer fa tw-mr-1" fixedWidth />,
    taxonomies: <FontAwesomeIcon icon={faChartPie} className="pointer fa tw-mr-1" fixedWidth />,
  }[label]);

const TreeNode = ({ className = '', setCollapsed, navSetting, item }) => {
  const calculatedClassName = `${className} item ${item.current ? 'active' : 'inactive'}`;

  const hasChildren = item.items.length > 0;

  const click = () => {
    setCollapsed(item['url']);
  };

  const icon = getIcon(item.label);

  return (
    <li className={calculatedClassName}>
      {item.title && (
        <Link to={item.url} onClick={click}>
          {icon && <>{icon} </>}
          <Trans>{item.title}</Trans>
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
