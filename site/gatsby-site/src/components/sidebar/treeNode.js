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
    spatial: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 8.4666665 8.4666669"
        style={{ width: '1.25em', marginRight: '0.25rem' }}
        fill="currentColor"
        stroke="none"
      >
        <circle id="c1" cx="1.4249661" cy="3.3814588" r="1.2797676" />
        <circle id="c2" cx="2.6276002" cy="6.9394135" r="1.2797676" />
        <circle id="c3" cx="4.7233200" cy="4.6742487" r="1.2797676" />
        <circle id="c4" cx="6.6127176" cy="6.8885708" r="1.2797676" />
        <circle id="c5" cx="6.1704326" cy="1.5272532" r="1.2797676" />
      </svg>
    ),
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
