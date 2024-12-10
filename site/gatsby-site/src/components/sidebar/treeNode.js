import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'react-feather';
import Link from '../ui/Link'; // Assuming you have this component for internal links
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faChartPie,
  faDice,
  faDoorOpen,
  faList,
  faMedal,
  faNewspaper,
  faPlusCircle,
  faSearch,
  faShapes,
  faSquareCheck,
  faTable,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'flowbite-react';

const TreeNode = ({
  item,
  isCollapsed,
  onClick,
  setNavCollapsed,
  level = 0,
  className = '',
  isExpanded,
  toggleExpand,
  expandedNodes,
  isMobile,
}) => {
  const hasChildren = item.items && item.items.length > 0;

  const icon = getIcon(item.label, item.current);

  const calculatedClassName = `${className || ''} item ${
    item.current
      ? 'active bg-light-orange text-white dark:bg-gray-700'
      : 'text-white md:text-inherit hover:bg-light-orange dark:text-white hover:text-white dark:hover:bg-gray-700'
  }`;

  // Ensure keyboard accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpand(item);
    }
  };

  const { t } = useTranslation();

  return (
    <li className="tree-node" data-testid={'sidebar-' + item.label}>
      <div
        className={`tree-node-header flex items-center cursor-pointer rounded-md ${
          isCollapsed ? 'collapsed' : ''
        }`}
        aria-expanded={isExpanded}
        aria-label={item.title}
      >
        {/* Link to the item if it has a URL or Path */}
        {item.url || item.path ? (
          <Link
            title={item.title}
            to={item.url || item.path}
            onClick={onClick}
            className={`hover:no-underline flex rounded-lg items-center p-2 md:text-base font-normal group transition-none w-full ${
              isCollapsed ? 'w-10 h-10' : ''
            } ${calculatedClassName}`}
            data-testid={`sidebar-link${item.current ? '-active' : ''}`}
          >
            {icon &&
              (isCollapsed ? (
                <Tooltip content={t(item.title)} placement="right">
                  {icon}
                </Tooltip>
              ) : (
                <>{icon}</>
              ))}
            {!isCollapsed && (
              <span className={`ml-3 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                <Trans>{item.title}</Trans>
              </span>
            )}
          </Link>
        ) : (
          <span className="tree-node-title ml-3">
            <Trans>{item.title}</Trans>
          </span>
        )}
        {/* Toggle Icon (if it has children) */}
        {hasChildren && !isCollapsed && (
          <span
            className={`mr-2 ${isMobile ? 'text-white' : ''}`}
            onClick={() => toggleExpand(item)} // Only clicking the arrow expands/collapses
            role="button" // Adding interactive role
            tabIndex={0} // Making it focusable
            onKeyDown={handleKeyDown} // Keyboard accessibility
            style={{ cursor: 'pointer' }}
          >
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
          </span>
        )}
      </div>

      {/* Render children recursively */}
      {hasChildren && isExpanded && (
        <ul className={`ml-${(level + 1) * 4} space-y-1 mt-1`}>
          {item.items.map((childItem) => (
            <TreeNode
              key={childItem.url || childItem.path || childItem.title}
              item={childItem}
              isCollapsed={isCollapsed}
              onClick={onClick}
              setNavCollapsed={setNavCollapsed}
              level={level + 1}
              isExpanded={
                expandedNodes[childItem.url || childItem.path || childItem.title] || false
              } // Pass down expanded state
              toggleExpand={toggleExpand} // Pass down toggleExpand function
              expandedNodes={expandedNodes}
              isMobile={isMobile}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// Helper function to get the icon
function getIcon(label, current = false) {
  const fontAwesomeStyles = `
    w-6 h-6
    transition-[width] duration-500 
    group-hover:text-white 
    dark:group-hover:text-white 
    pointer fa
    ${current ? 'text-white' : 'text-gray-400 md:text-gray-600'}
  `;

  return (
    {
      welcome: (
        <FontAwesomeIcon titleId="welcome" icon={faDoorOpen} className={fontAwesomeStyles} />
      ),
      discover: (
        <FontAwesomeIcon titleId="discover" icon={faSearch} className={fontAwesomeStyles} />
      ),
      submit: (
        <FontAwesomeIcon titleId="submit" icon={faPlusCircle} className={fontAwesomeStyles} />
      ),
      leaderboard: (
        <FontAwesomeIcon titleId="leaderboard" icon={faMedal} className={fontAwesomeStyles} />
      ),
      list: <FontAwesomeIcon titleId="list" icon={faList} className={fontAwesomeStyles} />,
      blog: <FontAwesomeIcon titleId="blog" icon={faNewspaper} className={fontAwesomeStyles} />,
      taxonomies: (
        <FontAwesomeIcon titleId="taxonomies" icon={faChartPie} className={fontAwesomeStyles} />
      ),
      incidents: (
        <FontAwesomeIcon titleId="incidents" icon={faTable} className={fontAwesomeStyles} />
      ),
      entities: (
        <FontAwesomeIcon titleId="entities" icon={faBuilding} className={fontAwesomeStyles} />
      ),
      user: <FontAwesomeIcon titleId="user" icon={faUser} className={fontAwesomeStyles} />,
      checklists: (
        <FontAwesomeIcon titleId="checklists" icon={faSquareCheck} className={fontAwesomeStyles} />
      ),
      random: <FontAwesomeIcon titleId="random" icon={faDice} className={fontAwesomeStyles} />,
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
      newsdigest: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 12 12"
          fill="currentColor"
          stroke="none"
          className={`
          w-6 h-6 shrink-0
          ${current ? 'text-white' : 'text-gray-400 md:text-gray-600'}
          group-hover:text-white dark:group-hover:text-white
        `}
        >
          <rect x="0" y="2" width="5.5" height="2" rx="1" />
          <rect x="0" y="5" width="5.5" height="2" rx="1" />
          <rect x="0" y="8" width="5.5" height="2" rx="1" />

          <rect x="6.5" y="2" width="5.5" height="2" rx="1" />
          <rect x="6.5" y="5" width="5.5" height="2" rx="1" />
          <rect x="6.5" y="8" width="5.5" height="2" rx="1" />
        </svg>
      ),
    }[label] || <FontAwesomeIcon titleId={label} icon={faShapes} className={fontAwesomeStyles} />
  );
}

TreeNode.propTypes = {
  item: PropTypes.object.isRequired,
  isCollapsed: PropTypes.bool,
  onClick: PropTypes.func,
  setNavCollapsed: PropTypes.func,
  level: PropTypes.number,
  className: PropTypes.string,
  isExpanded: PropTypes.bool,
  toggleExpand: PropTypes.func,
  expandedNodes: PropTypes.object,
};

export default TreeNode;
