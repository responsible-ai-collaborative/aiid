import React from 'react';
import { Tooltip } from 'flowbite-react';
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
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TreeNode = ({ className = '', setCollapsed, navSetting, item, isCollapsed = false }) => {
  const calculatedClassName = `${className} item ${
    item.current
      ? 'bg-light-orange text-white dark:bg-gray-700'
      : 'text-white md:text-inherit hover:bg-light-orange dark:text-white hover:text-white dark:hover:bg-gray-700'
  }`;

  const hasChildren = item.items.length > 0;

  const click = () => {
    setCollapsed(item['url']);
  };

  const icon = getIcon(item.label, item.current);

  return (
    <>
      <li className={`z-50`} data-cy={'sidebar-' + item.label}>
        <NodeLink
          item={item}
          isCollapsed={isCollapsed}
          click={click}
          icon={icon}
          hasChildren={hasChildren}
          calculatedClassName={calculatedClassName}
        />

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

const NodeLink = ({
  item,
  isCollapsed = false,
  click,
  icon,
  hasChildren,
  calculatedClassName,
  title,
}) => (
  <Link
    title={title}
    to={item.url}
    onClick={click}
    className={`${
      isCollapsed ? 'w-10 h-10' : ''
    } flex rounded-lg items-center p-2 md:text-base font-normal group transition-none ${calculatedClassName}`}
  >
    {icon &&
      (isCollapsed ? (
        <Tooltip content={item.title} placement="right">
          {icon}
        </Tooltip>
      ) : (
        <>{icon}</>
      ))}
    <span
      className={`${
        isCollapsed ? 'h-0 w-0 m-0 p-0 overflow-hidden opacity-0 ' : 'opacity-100'
      } transition-[font-size] duration-500`}
      style={{ fontSize: isCollapsed ? '0' : undefined }}
    >
      <span className="ml-3 block transition-none">
        <Trans>{item.title}</Trans>
      </span>
      {!config.sidebar.frontLine && item.title && hasChildren ? (
        <button onClick={click} aria-label="collapse" className="collapser">
          {!item.collapsed ? <OpenedSvg /> : <ClosedSvg />}
        </button>
      ) : null}
    </span>
  </Link>
);

function getIcon(label, current = false) {
  const fontAwesomeStyles = `
    w-6 h-6
    transition-[width] duration-500 

    group-hover:text-white 
    dark:group-hover:text-white 
    pointer fa
    
    ${current ? 'text-white' : 'text-gray-400 md:text-gray-600'}
  `;

  return {
    welcome: <FontAwesomeIcon titleId="welcome" icon={faDoorOpen} className={fontAwesomeStyles} />,
    discover: <FontAwesomeIcon titleId="discover" icon={faSearch} className={fontAwesomeStyles} />,
    submit: <FontAwesomeIcon titleId="submit" icon={faPlusCircle} className={fontAwesomeStyles} />,
    leaderboard: (
      <FontAwesomeIcon titleId="leaderboard" icon={faMedal} className={fontAwesomeStyles} />
    ),
    wordcounts: (
      <FontAwesomeIcon titleId="wordcounts" icon={faSortAlphaDown} className={fontAwesomeStyles} />
    ),
    blog: <FontAwesomeIcon titleId="blog" icon={faNewspaper} className={fontAwesomeStyles} />,
    taxonomies: (
      <FontAwesomeIcon titleId="taxonomies" icon={faChartPie} className={fontAwesomeStyles} />
    ),
    incidents: <FontAwesomeIcon titleId="incidents" icon={faTable} className={fontAwesomeStyles} />,
    entities: (
      <FontAwesomeIcon titleId="entities" icon={faBuilding} className={fontAwesomeStyles} />
    ),
    user: <FontAwesomeIcon titleId="user" icon={faUser} className={fontAwesomeStyles} />,
    spatial: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 8.4666665 8.4666669"
        fill="currentColor"
        stroke="none"
        className={`
          w-6 h-6 shrink-0
          ${current ? 'text-white' : 'text-gray-400 md:text-gray-600'}
          group-hover:text-white dark:group-hover:text-white
        `}
      >
        <circle id="c1" cx="1.4249661" cy="3.3814588" r="1.2797676" />
        <circle id="c2" cx="2.6276002" cy="6.9394135" r="1.2797676" />
        <circle id="c3" cx="4.7233200" cy="4.6742487" r="1.2797676" />
        <circle id="c4" cx="6.6127176" cy="6.8885708" r="1.2797676" />
        <circle id="c5" cx="6.1704326" cy="1.5272532" r="1.2797676" />
      </svg>
    ),
  }[label];
}

export default TreeNode;
