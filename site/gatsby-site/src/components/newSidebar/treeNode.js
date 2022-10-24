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
  faTable,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

const getIcon = (label, current = false) =>
  ({
    welcome: (
      <FontAwesomeIcon
        icon={faDoorOpen}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
    discover: (
      <FontAwesomeIcon
        icon={faSearch}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
    submit: (
      <FontAwesomeIcon
        icon={faPlusCircle}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
    leaderboard: (
      <FontAwesomeIcon
        icon={faMedal}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
    wordcounts: (
      <FontAwesomeIcon
        icon={faSortAlphaDown}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
    blog: (
      <FontAwesomeIcon
        icon={faNewspaper}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
    taxonomies: (
      <FontAwesomeIcon
        icon={faChartPie}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
    incidents: (
      <FontAwesomeIcon
        icon={faTable}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
    spatial: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 8.4666665 8.4666669"
        style={{ width: '1.25em', marginRight: '0.25rem' }}
        fill="currentColor"
        stroke="none"
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white`}
      >
        <circle id="c1" cx="1.4249661" cy="3.3814588" r="1.2797676" />
        <circle id="c2" cx="2.6276002" cy="6.9394135" r="1.2797676" />
        <circle id="c3" cx="4.7233200" cy="4.6742487" r="1.2797676" />
        <circle id="c4" cx="6.6127176" cy="6.8885708" r="1.2797676" />
        <circle id="c5" cx="6.1704326" cy="1.5272532" r="1.2797676" />
      </svg>
    ),
    entities: (
      <FontAwesomeIcon
        icon={faBuilding}
        className={`w-6 h-6 ${
          current ? 'text-white' : 'text-gray-500'
        } transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white pointer fa mr-1`}
        fixedWidth
      />
    ),
  }[label]);

const TreeNode = ({ className = '', setCollapsed, navSetting, item, isCollapsed = false }) => {
  const calculatedClassName = `${className} item ${
    item.current
      ? 'bg-light-orange text-white dark:bg-gray-700'
      : 'text-gray-900 hover:bg-light-orange dark:text-white  hover:text-white dark:hover:bg-gray-700'
  }`;

  const hasChildren = item.items.length > 0;

  const click = () => {
    setCollapsed(item['url']);
  };

  const icon = getIcon(item.label, item.current);

  return (
    <>
      <li className="z-50">
        {item.title && (
          <Tooltip content={item.title} placement="right">
            <Link
              to={item.url}
              onClick={click}
              className={`flex rounded-lg items-center p-2 text-base font-normal group ${calculatedClassName} ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              {icon && <>{icon} </>}
              <span
                className={`${
                  isCollapsed ? 'h-0 w-0 opacity-0 ' : 'opacity-100'
                } transition-opacity duration-500`}
              >
                <span className="ml-3">
                  <Trans>{item.title}</Trans>
                </span>
                {!config.sidebar.frontLine && item.title && hasChildren ? (
                  <button onClick={click} aria-label="collapse" className="collapser">
                    {!item.collapsed ? <OpenedSvg /> : <ClosedSvg />}
                  </button>
                ) : null}
              </span>
            </Link>
          </Tooltip>
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
    </>
  );
};

export default TreeNode;
